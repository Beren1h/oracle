using LiteDB;
using System;
using System.Collections.Generic;
using System.Text;

namespace Frame.Models
{
    public class Pool
    {
        public ObjectId _id { get; set; }
        public DateTime Date { get; set; }
        public decimal Amount { get; set; }

    }
}
