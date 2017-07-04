using Frame.Collections;
using Frame.Models;
using LiteDB;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;

namespace Frame
{
    public class Bill
    {
        public ObjectId _id { get; set; }
        public DateTime Date { get; set; }
        public Decimal Amount { get; set; }
        public string Pot { get; set; }
        public string Note { get; set; }
    }

    public class Class2
    {
        public void DoOtherThings()
        {
            var data = new AssignmentCollection();

            var assignment = new Assignment
            {
                Date = DateTime.Now,
                Amount = 334.51M,
                Envelope = Envelope.cable,
                Note = "test note",
                IsPoolDebit = true
            };

            // data.InsertAssignment(assignment);

            Expression<Func<Assignment, bool>> q = a => a.IsPoolDebit == true && a.Envelope == Envelope.cable;

            var get = data.Get(q).ToList();

            

            int z = 1;
        }

        public void DoThings()
        {
            using (var db = new LiteDatabase("c:\\oracle\\2017.db"))
            {
                //var barrels = db.GetCollection<Barrel>("barrels");

                //var assignment = new Assignment
                //{
                //    Date = DateTime.Now,
                //    Amount = 334.51M,
                //    Stamp = Stamp.cell,
                //    Pool = true,
                //    Note = "testing enums"
                //};

                //barrels.Insert(barrel);

                //var get = barrels.FindOne(x => x.Stamp == Stamp.cell);

                int z = 1;
                // var bills = db.GetCollection<Bill>("bills");
                
                //var bill = new Bill
                //{
                //    Date = new DateTime(2017, 07, 03),
                //    Amount = 334.51M,
                //    Pot = "Mortgage",
                //    Note = "Testing"
                //};

                //bills.Insert(bill);

                //var results = bills.Find(x => x.Date == new DateTime(2017, 07, 03));
                
                //foreach(var b in results)
                //{
                //    b.Note = "I changed the note";
                //    bills.Update(b);
                //}

                //var results2 = bills.FindOne(x => x.Date == new DateTime(2017, 07, 03));

                //if (results2 != null)
                //{
                //    bills.Delete(results2._id);
                //}

                


                // int z = 1;


            }
        }
    }
}
