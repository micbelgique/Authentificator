using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Microsoft.Azure.CognitiveServices.Vision.Face;
using Microsoft.Azure.CognitiveServices.Vision.Face.Models;

namespace Authentificator.Utils
{
    static public class Image
    {
        public static Stream FromBytesToStream(byte[] image)
        {
            return new MemoryStream(image);
        }

        public static byte[] FromB64ToBytes(string image)
        {
            return Convert.FromBase64String(image);
        }
        public static string FromBytesToB64(byte[] image)
        {
            return Convert.ToBase64String(image);
        }
        public static byte[] FromStreamToBytes(MemoryStream image)
        {
            return image.ToArray();
        }
    }
}