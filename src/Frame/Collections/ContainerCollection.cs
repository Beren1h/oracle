using Frame.Models;
using LiteDB;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace Frame.Collections
{
    public class ContainerCollection : IDbCollection<Container>
    {
        private LiteCollection<Container> _collection;

        public ContainerCollection(LiteDatabase db)
        {
            _collection = db.GetCollection<Container>("Container");
        }

        public bool Delete(ObjectId _id)
        {
            return _collection.Delete(_id);
        }

        public IEnumerable<Container> Get(Expression<Func<Container, bool>> query)
        {
            return _collection.Find(query);
        }

        public ObjectId Insert(Container document)
        {
            return _collection.Insert(document);
        }


        public bool Update(Container document)
        {
            return _collection.Update(document);
        }
    }
}
