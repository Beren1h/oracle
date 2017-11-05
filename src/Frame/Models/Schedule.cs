using LiteDB;
using System;
using System.Collections.Generic;
using System.Text;

namespace Frame.Models
{
    public class Schedule
    {
        public ObjectId _id { get; set; }
        public string Name { get; set; }
        public Container? Envelope { get; set; }
        public IEnumerable<Transaction> Transactions { get; set; }

    }
}
