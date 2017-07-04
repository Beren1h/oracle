using LiteDB;
using System;

namespace Frame.Models
{
    public class Pool
    {
        public ObjectId _id { get; set; }
        public DateTime Date { get; set; }
        public decimal Amount { get; set; }
        public string Note { get; set; }
    }
}
