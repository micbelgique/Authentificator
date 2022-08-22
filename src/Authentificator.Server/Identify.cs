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
    public class Identify
    {
        [FunctionName("Identify")]
        [OpenApiOperation(operationId: "Run", tags: new[] { "picture" })]
        [OpenApiRequestBody(contentType: "application/json", bodyType: typeof(IdentifyRequest))]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "text/plain", bodyType: typeof(string), Description = "The OK response")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.BadRequest, contentType: "text/plain", bodyType: typeof(string), Description = "The BadRequest response")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)] HttpRequest req)
        {
            var requestBody = await req.ReadAsStringAsync();
            var registerRequest = JsonConvert.DeserializeObject<IdentifyRequest>(requestBody);

            var personGroupId = Environment.GetEnvironmentVariable("personGroupId");
            var userId = await Face.IdentifyPerson(personGroupId, Image.FromB64ToBytes(registerRequest.Picture));
            if (userId == Guid.Empty)
            {
                return new BadRequestObjectResult("User not found");
            }
            var user = new { UserId = userId };
            return new OkObjectResult(user);
        }
    }
}

