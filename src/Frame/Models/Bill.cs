using LiteDB;
using System;

namespace Frame.Models
{
    public class Bill
    {
        public ObjectId _id { get; set; }
        public string Name { get; set; }
        public DateTime Next { get; set; }
        public decimal Amount { get; set; }
        public string Frequency { get; set; }
    }
}
