using LiteDB;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace Frame.Collections
{
    public interface IDbCollection<D> 
    {
        void Insert(D document);

        void Insert(IEnumerable<D> documents);

        void Delete(ObjectId _id);

        void Update(D document);

        IEnumerable<D> Get(Expression<Func<D, bool>> query);
    }
}
