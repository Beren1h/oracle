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
    }
}
