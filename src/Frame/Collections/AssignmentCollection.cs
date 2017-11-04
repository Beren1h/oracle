using Frame.Models;
using System;
using System.Collections.Generic;
using LiteDB;
using System.Linq.Expressions;

namespace Frame.Collections
{
    public class AssignmentCollection : IDbCollection<Assignment>
    {
        private LiteCollection<Assignment> _collection;

        public AssignmentCollection(LiteDatabase db)
        {
            _collection = db.GetCollection<Assignment>("assignments");
        }

        public void Delete(ObjectId _id)
        {
            _collection.Delete(_id);
        }

        public IEnumerable<Assignment> Get(Expression<Func<Assignment, bool>> query)
        {
            return _collection.Find(query);
        }

        public void Insert(Assignment document)
        {
            _collection.Insert(document);
        }

        public void Insert(IEnumerable<Assignment> documents)
        {
            _collection.Insert(documents);
        }

        public void Update(Assignment document)
        {
            _collection.Update(document);
        }
    }
}
