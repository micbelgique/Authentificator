using System;
using System.IO;
using System.Net;
using System.Threading.Tasks;
using Authentificator.Models;
using Authentificator.Services;
using Authentificator.Utils;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json;

namespace Authentificator.Functions
{
    public class UpdatePreferences
    {
        private readonly ILogger<Identify> _logger;

        public UpdatePreferences(ILogger<Identify> log)
        {
            _logger = log;
        }

        [FunctionName("UpdatePreferences")]
        [return: CosmosDB(databaseName: "AuthentificatorDB", collectionName: "Persons", ConnectionStringSetting = "CosmosDBConnectionString")]
        public static async Task<User> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "patch", Route = "settings/preferences/{userId}")] HttpRequest req,
            [CosmosDB(databaseName: "AuthentificatorDB", collectionName: "Persons", ConnectionStringSetting = "CosmosDBConnectionString", PartitionKey = "{userId}", Id = "{userId}")] User user)
        {
            var requestBody = await req.ReadAsStringAsync();
            var registerRequest = JsonConvert.DeserializeObject<UpdatePreferencesRequest>(requestBody);

            user.FavouriteCoffee = registerRequest.FavouriteCoffee;

            return user;
        }
    }
}

