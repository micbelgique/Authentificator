using System;
using System.Collections.Generic;

namespace Authentificator.Models
{
    public class User
    {
        public Guid Id { get; set; }
        public Guid PersonId { get; set; }
        public string PersonGroupId { get; set; }
        public string Name { get; set; } = "";
        public string FavouriteCoffee { get; set; } = "";
        public string AvatarUrl { get; set; } = "";
        public bool IsPermanent { get; set; } = false;
        public DateTime Created { get; set; }
        public string Pk { get; } = "pk";
    }
}