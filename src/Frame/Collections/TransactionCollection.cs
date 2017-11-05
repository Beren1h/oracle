﻿using Frame.Models;
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

        public bool Delete(ObjectId _id)
        {
            return _collection.Delete(_id);
        }

        public IEnumerable<Transaction> Get(Expression<Func<Transaction, bool>> query)
        {
            return _collection.Find(query);
        }

        public ObjectId Insert(Transaction document)
        {
            return _collection.Insert(document);
        }

        public bool Update(Transaction document)
        {
            return _collection.Update(document);
        }
    }
}
