using System;
using System.Collections.Generic;

namespace Authentificator.Models
{
    public class UpdatePreferencesRequest
    {
        public Guid UserId { get; set; }
        public string FavouriteCoffee { get; set; }
        public string Name { get; set; }
    }
}