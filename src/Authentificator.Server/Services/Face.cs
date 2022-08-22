using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Authentificator.Utils;

using Microsoft.Azure.CognitiveServices.Vision.Face;
using Microsoft.Azure.CognitiveServices.Vision.Face.Models;

namespace Authentificator.Services
{
    static public class Face
    {
        private static readonly Lazy<FaceClient> lazyFaceClient = new(InitializeFaceClient);
        private static FaceClient FaceClient => lazyFaceClient.Value;
        private static FaceClient InitializeFaceClient()
        {
            return new(new ApiKeyServiceClientCredentials(Environment.GetEnvironmentVariable("CognitiveServicesApiKey"))) { Endpoint = Environment.GetEnvironmentVariable("CognitiveServicesEndpoint") };
        }

        private static async Task<List<DetectedFace>> FilteredFaces(byte[] image, QualityForRecognition qualityForRecognitionMin = QualityForRecognition.High)
        {
            // Detect faces from image URL. Since only recognizing, use the recognition model 1.
            // We use detection model 3 because we are not retrieving attributes.
            using var stream = Image.FromBytesToStream(image);
            IList<DetectedFace> detectedFaces = await FaceClient.Face.DetectWithStreamAsync(stream, true, false, recognitionModel: RecognitionModel.Recognition04, detectionModel: DetectionModel.Detection03, returnFaceAttributes: new List<FaceAttributeType> { FaceAttributeType.QualityForRecognition });
            List<DetectedFace> sufficientQualityFaces = new();
            foreach (DetectedFace detectedFace in detectedFaces)
            {
                var faceQualityForRecognition = detectedFace.FaceAttributes.QualityForRecognition;
                if (faceQualityForRecognition.HasValue && (faceQualityForRecognition.Value >= qualityForRecognitionMin))
                {
                    sufficientQualityFaces.Add(detectedFace);
                }
            }
            return sufficientQualityFaces;
        }

        public static async Task<List<byte[]>> FilteredImages(List<byte[]> images, QualityForRecognition qualityForRecognitionMin = QualityForRecognition.High)
        {
            List<byte[]> filteredImages = new();
            foreach (byte[] image in images)
            {
                List<DetectedFace> faces = await FilteredFaces(image, qualityForRecognitionMin);
                if (faces.Count > 0)
                {
                    Console.WriteLine($"Found {faces.Count} faces in image");
                    filteredImages.Add(image);
                }
            }
            return filteredImages;
        }

        // Create PersonGroup
        public static async Task CreatePersonGroup(string personGroupId)
        {
            try
            {

                await FaceClient.PersonGroup.CreateAsync(personGroupId, personGroupId, recognitionModel: RecognitionModel.Recognition04);
            }
            catch (APIErrorException e)
            {

                Console.WriteLine("Group already exists");
            }
        }

        public static async Task<Guid> CreatePerson(string personGroupId, string name)
        {
            var person = await FaceClient.PersonGroupPerson.CreateAsync(personGroupId, name: name);
            return person.PersonId;
        }

        public static async Task Train(string personGroupId)
        {
            await FaceClient.PersonGroup.TrainAsync(personGroupId);
        }

        public static async Task AddFaceToPerson(string personGroupId, Guid personId, byte[] image)
        {
            using var stream = Image.FromBytesToStream(image);
            await FaceClient.PersonGroupPerson.AddFaceFromStreamAsync(personGroupId, personId, stream);
        }

        public static async Task<Guid> IdentifyPerson(string personGroupId, byte[] image)
        {
            List<DetectedFace> faces = await FilteredFaces(image);
            if (faces.Count > 0)
            {
                List<Guid> personIds = faces.Select(f => f.FaceId.Value).ToList();
                var identifyResults = await FaceClient.Face.IdentifyAsync(personIds, personGroupId);
                if (identifyResults.Count > 0)
                {
                    var identifyResult = identifyResults[0];
                    if (identifyResult.Candidates.Count > 0)
                    {
                        var candidate = identifyResult.Candidates[0];
                        Person person = await FaceClient.PersonGroupPerson.GetAsync(personGroupId, candidate.PersonId);
                        Console.WriteLine($"Person {person.Name} is identified with {candidate.Confidence * 100}% confidence");
                        return new Guid(person.Name);
                    }
                    else
                    {
                        Console.WriteLine("No one is identified");
                    }
                }
            }
            return Guid.Empty;
        }
    }
}