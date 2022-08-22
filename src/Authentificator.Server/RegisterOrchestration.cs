using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Authentificator.Models;
using Authentificator.Services;
using Authentificator.Utils;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.CognitiveServices.Vision.Face.Models;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.DurableTask;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace Authentificator.Functions
{
    public static class RegisterOrchestration
    {
        [FunctionName("RegisterOrchestration")]
        public static async Task<string> RunOrchestrator(
            [OrchestrationTrigger] IDurableOrchestrationContext context, ILogger log)
        {
            var request = context.GetInput<RegisterRequest>();


            var personGroupId = await context.CallActivityAsync<string>("RegisterOrchestration_GetPersonGroupId", null);

            await context.CallActivityAsync("RegisterOrchestration_CreatePersonGroup", personGroupId);

            var userId = await context.CallActivityAsync<Guid>("RegisterOrchestration_CreateUserId", null);
            var personId = await context.CallActivityAsync<Guid>("RegisterOrchestration_CreatePerson", (personGroupId, userId));

            var filteredImages = await context.CallActivityAsync<List<byte[]>>("RegisterOrchestration_FilteredImages", request.Pictures);
            if (filteredImages.Count < 3)
            {
                throw new Exception("Not enough good images");
            }
            await context.CallActivityAsync("RegisterOrchestration_AddFacesToPerson", (personGroupId, personId, filteredImages));
            var avatarUrl = await context.CallActivityAsync<string>("RegisterOrchestration_CreateAvatar", userId);
            await Task.WhenAll(new[] {
                context.CallActivityAsync("RegisterOrchestration_TrainPersonGroup", personGroupId),
                context.CallActivityAsync("RegisterOrchestration_CreatePersonDB", (personGroupId, personId, userId, avatarUrl))
            });


            return userId.ToString();
        }

        [FunctionName("RegisterOrchestration_GetPersonGroupId")]
        public static string GetPersonGroupId([ActivityTrigger] IDurableActivityContext context)
        {
            return Environment.GetEnvironmentVariable("personGroupId");
        }


        [FunctionName("RegisterOrchestration_CreatePersonGroup")]
        public static async Task CreatePersonGroup([ActivityTrigger] string personGroupId)
        {
            await Face.CreatePersonGroup(personGroupId);
        }

        [FunctionName("RegisterOrchestration_CreatePerson")]
        public static async Task<Guid> CreatePerson([ActivityTrigger] IDurableActivityContext context)
        {
            var (personGroupId, userId) = context.GetInput<(string, Guid)>();
            return await Face.CreatePerson(personGroupId, userId.ToString());
        }

        [FunctionName("RegisterOrchestration_CreateUserId")]
        public static Guid CreateUserId([ActivityTrigger] IDurableActivityContext context)
        {
            return Guid.NewGuid();
        }


        [FunctionName("RegisterOrchestration_FilteredImages")]
        public static async Task<List<byte[]>> FilterImages([ActivityTrigger] List<string> pictures)
        {
            var images = pictures.Select(p => Image.FromB64ToBytes(p)).ToList();
            return await Face.FilteredImages(images);
        }

        [FunctionName("RegisterOrchestration_AddFacesToPerson")]
        public static async Task AddFacesToPerson([ActivityTrigger] IDurableActivityContext context)
        {
            var (personGroupId, personId, filteredImages) = context.GetInput<(string, Guid, List<byte[]>)>();
            await Task.WhenAll(filteredImages.Select(f => Face.AddFaceToPerson(personGroupId, personId, f)));
        }

        [FunctionName("RegisterOrchestration_CreatePersonDB")]
        [return: CosmosDB(databaseName: "AuthentificatorDB", collectionName: "Persons", ConnectionStringSetting = "CosmosDBConnectionString")]
        public static User CreatePersonDB([ActivityTrigger] IDurableActivityContext context)
        {
            var (personGroupId, personId, userId, avatarUrl) = context.GetInput<(string, Guid, Guid, string)>();
            var newUser = new User { Id = userId, PersonId = personId, PersonGroupId = personGroupId, AvatarUrl = avatarUrl };
            return newUser;

        }

        [FunctionName("RegisterOrchestration_TrainPersonGroup")]
        public static async Task TrainPersonGroup([ActivityTrigger] string personGroupId)
        {
            await Face.Train(personGroupId);
        }
        [FunctionName("RegisterOrchestration_CreateAvatar")]
        public static string CreateAvatar([ActivityTrigger] string userId)
        {
            return $"https://avatars.dicebear.com/api/big-smile/{userId}.svg";
        }

        [FunctionName("RegisterOrchestration_HttpStart")]
        public static async Task<IActionResult> HttpStart(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "register")] HttpRequest req,
            [DurableClient] IDurableOrchestrationClient starter,
            ILogger log)
        {
            var requestBody = await req.ReadAsStringAsync();
            var registerRequest = JsonConvert.DeserializeObject<RegisterRequest>(requestBody);


            string instanceId = await starter.StartNewAsync("RegisterOrchestration", registerRequest);



            log.LogInformation($"Started orchestration with ID = '{instanceId}'.");

            req.HttpContext.Response.Headers.Add("Access-Control-Expose-Headers", "Location");
            return starter.CreateCheckStatusResponse(req, instanceId);
        }
    }
}