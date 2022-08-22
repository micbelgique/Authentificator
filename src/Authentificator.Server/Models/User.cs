using System;
using System.Collections.Generic;

namespace Authentificator.Models
{
    public class User
    {
        public Guid Id { get; set; }
        public Guid PersonId { get; set; }
        public string PersonGroupId { get; set; }
        public string FavouriteCoffee { get; set; } = "";
        public string AvatarUrl { get; set; } = "";
    }
}