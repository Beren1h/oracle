using Frame.Models;
using LiteDB;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace Frame.Collections
{
    public class DoleCollection : IDbCollection<Dole>
    {
        private LiteCollection<Dole> _collection;

        public DoleCollection(LiteDatabase db)
        {
            _collection = db.GetCollection<Dole>("Dole");
        }

        public bool Delete(ObjectId _id)
        {
            return _collection.Delete(_id);
        }

        public IEnumerable<Dole> Get(Expression<Func<Dole, bool>> query)
        {
            return _collection.Find(query);
        }

        public ObjectId Insert(Dole document)
        {
            return _collection.Insert(document);
        }


        public bool Update(Dole document)
        {
            return _collection.Update(document);
        }
    }
}
