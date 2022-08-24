using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Authentificator.Services;
using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;
using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Logging;

namespace Authentificator.Functions
{
    public class CleanUpUsers
    {
        [FunctionName("CleanUpUsers")]
        public static async Task RunAsync([TimerTrigger("0 0 3 * * 1-5")] TimerInfo myTimer, ILogger log,
                    [CosmosDB(databaseName: "AuthentificatorDB", collectionName: "Persons", ConnectionStringSetting = "CosmosDBConnectionString")] DocumentClient client)
        {
            var collectionUri = UriFactory.CreateDocumentCollectionUri("AuthentificatorDB", "Persons");

            // TODO: add filter
            var query = client.CreateDocumentQuery<Models.User>(collectionUri, new FeedOptions { MaxItemCount = -1, PartitionKey = new PartitionKey("pk") })
               .AsQueryable();

            var tasks = new List<Task>();
            foreach (var person in query)
            {
                tasks.Add(client.DeleteDocumentAsync(UriFactory.CreateDocumentUri("AuthentificatorDB", "Persons", person.Id.ToString()), new RequestOptions { PartitionKey = new PartitionKey("pk") }));
                tasks.Add(Face.DeletePerson(person.PersonGroupId, person.PersonId));
            }
            await Task.WhenAll(tasks);
            log.LogInformation($"Cleaning up {tasks.Count / 2} users");
        }
    }
}
