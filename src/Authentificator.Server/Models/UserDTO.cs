using System;

namespace Authentificator.Models
{
    public class UserDTO
    {
        public Guid Id { get; set; }
        public string PersonGroupId { get; set; }
        public string Name { get; set; } = "";
        public string FavouriteCoffee { get; set; } = "";
        public string AvatarUrl { get; set; } = "";
        public DateTime Created { get; set; }
        public bool IsPermanent { get; set; } = false;

        public UserDTO(User user)
        {
            this.Id = user.Id;
            this.PersonGroupId = user.PersonGroupId;
            this.Name = user.Name;
            this.FavouriteCoffee = user.FavouriteCoffee;
            this.AvatarUrl = user.AvatarUrl;
            this.Created = user.Created;
            this.IsPermanent = user.IsPermanent;
        }
    }

}