using System.Net;
using Authentificator.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;

namespace Authentificator.Functions
{
    public class GetUser
    {
        [FunctionName("GetUser")]
        [OpenApiOperation(operationId: "Run", tags: new[] { "name" })]
        [OpenApiParameter(name: "userID", In = ParameterLocation.Path, Required = true, Type = typeof(string), Description = "The **Name** parameter")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "text/plain", bodyType: typeof(string), Description = "The OK response")]
        public IActionResult Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = "user/{userID}")] HttpRequest req,
            [CosmosDB(
                databaseName: "AuthentificatorDB",
                collectionName: "Persons",
                ConnectionStringSetting = "CosmosDBConnectionString",
                PartitionKey = "pk", Id = "{userID}")] User user)
        {
            return new OkObjectResult(new UserDTO(user));
        }
    }
}

