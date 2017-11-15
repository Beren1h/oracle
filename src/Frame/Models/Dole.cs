using LiteDB;
using System;

namespace Frame.Models
{
    public class Dole
    {
        public ObjectId _id { get; set; }
        public DateTime Date { get; set; }
        public decimal Amount { get; set; }
        //account or envelope
        public ObjectId ContainerId { get; set; }
    }
}
