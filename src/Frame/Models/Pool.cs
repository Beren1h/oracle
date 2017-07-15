using LiteDB;
using Newtonsoft.Json;
using System;

namespace Frame.Models
{
    public class Pool
    {
        [JsonConverter(typeof(ObjectIdConverter))]
        public ObjectId _id { get; set; }
        public DateTime Date { get; set; }
        public decimal Amount { get; set; }
        public string Note { get; set; }
    }
}
