using System.Collections.Generic;
using System.Linq;
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
    public class GetUsers
    {
        [FunctionName("GetUsers")]
        [OpenApiOperation(operationId: "Run", tags: new[] { "name" })]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "text/plain", bodyType: typeof(string), Description = "The OK response")]
        public IActionResult Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = "users")] HttpRequest req,
            [CosmosDB(
                databaseName: "AuthentificatorDB",
                collectionName: "Persons",
                ConnectionStringSetting = "CosmosDBConnectionString"
                )] IEnumerable<User> users)
        {
            return new OkObjectResult(users.Select(u => new UserDTO(u)));
        }
    }
}

