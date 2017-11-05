using LiteDB;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace Frame.Collections
{
    public interface IDbCollection<D> 
    {
        ObjectId Insert(D document);

        // ObjectId Insert(IEnumerable<D> documents);

        bool Delete(ObjectId _id);

        bool Update(D document);

        IEnumerable<D> Get(Expression<Func<D, bool>> query);
    }
}
