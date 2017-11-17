using LiteDB;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;
using System.Text;

namespace Frame.Models
{
    public class Container
    {
        public ObjectId _id { get; set; }
        public ContainerType Type { get; set; }
        public ObjectId ParentId { get; set; }
        public string Name { get; set; }
    }

    [JsonConverter(typeof(StringEnumConverter))]
    public enum ContainerType
    {
        account,
        envelope
    }
}
