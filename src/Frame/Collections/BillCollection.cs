using System;
using System.Collections.Generic;
using LiteDB;
using Frame.Models;
using System.Linq.Expressions;

namespace Frame.Collections
{
    public class BillCollection : IDbCollection<Bill>
    {
        private LiteCollection<Bill> _collection;

        public BillCollection(LiteDatabase db)
        {
            _collection = db.GetCollection<Bill>("Bill");
        }

        public bool Delete(ObjectId _id)
        {
            return _collection.Delete(_id);
        }

        public IEnumerable<Bill> Get(Expression<Func<Bill, bool>> query)
        {
            return _collection.Find(query);
        }

        public ObjectId Insert(Bill document)
        {
            return _collection.Insert(document);
        }

        public bool Update(Bill document)
        {
            return _collection.Update(document);
        }
    }
}
