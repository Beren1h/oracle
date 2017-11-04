using Frame.Models;
using System;
using System.Collections.Generic;
using LiteDB;
using System.Linq.Expressions;

namespace Frame.Collections
{
    public class TransactionCollection : IDbCollection<Transaction>
    {
        private LiteCollection<Transaction> _collection;

        public TransactionCollection(LiteDatabase db)
        {
            _collection = db.GetCollection<Transaction>("transaction");
        }

        public void Delete(ObjectId _id)
        {
            _collection.Delete(_id);
        }

        public IEnumerable<Transaction> Get(Expression<Func<Transaction, bool>> query)
        {
            return _collection.Find(query);
        }

        public void Insert(Transaction document)
        {
            var x = _collection.Insert(document);
        }

        public void Insert(IEnumerable<Transaction> documents)
        {
            _collection.Insert(documents);
        }

        public void Update(Transaction document)
        {
            _collection.Update(document);
        }
    }
}
