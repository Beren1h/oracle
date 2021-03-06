﻿using Frame.Models;
using System;
using System.Collections.Generic;
using LiteDB;
using System.Linq.Expressions;

namespace Frame.Collections
{
    public class PoolCollection : IDbCollection<Pool>
    {
        private LiteCollection<Pool> _collection;

        public PoolCollection(LiteDatabase db)
        {
            _collection = db.GetCollection<Pool>("pools");
        }

        //public PoolCollection(string database)
        //{
        //    // using (var db = new LiteDatabase(Resources.Database.PATH))
        //    using (var db = new LiteDatabase(database))
        //    {
        //        _collection = db.GetCollection<Pool>("pools");
        //    }
        //}

        public void Delete(ObjectId _id)
        {
            _collection.Delete(_id);
        }

        public IEnumerable<Pool> Get(Expression<Func<Pool, bool>> query)
        {
            return _collection.Find(query);
        }
        public void Insert(Pool document)
        {
            _collection.Insert(document);
        }

        public void Insert(IEnumerable<Pool> documents)
        {
            _collection.Insert(documents);
        }

        public void Update(Pool document)
        {
            _collection.Update(document);
        }
    }
}
