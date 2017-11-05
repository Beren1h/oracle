using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Frame.Collections;
using Frame.Models;
using Microsoft.Extensions.Options;
using LiteDB;
using System.Collections.Generic;

namespace Web.Controllers
{
    [Produces("application/json")]
    [Route("api")]
    public class ApiController : Controller
    {
        //private readonly IDbCollection<Pool> _pools;
        //private readonly IDbCollection<Assignment> _assignments;
        private readonly IDbCollection<Transaction> _transactions;
        private readonly IDbCollection<Container> _containers;

        private readonly AppSettings _settings;

        public ApiController(IDbCollection<Transaction> transactions,
            IDbCollection<Container> containers,
            IOptions<AppSettings> settings)
        {
            _transactions = transactions;
            _containers = containers;
            //_pools = pools;
            //_assignments = assignments;
            _settings = settings.Value;
        }

        [HttpGet, Route("objectid")]
        public IActionResult CreateObjectId()
        {
            return Ok(ObjectId.NewObjectId());
        }


        [HttpGet, Route("container")]
        public IActionResult GetContainers()
        {
            var result = _containers.Get(a => a._id != null);
 
            return Ok(result);
        }


        [HttpPut, Route("container")]
        public IActionResult CreateContainer([FromBody] Container container)
        {
            var result = _containers.Insert(container);

            return Ok(result);
        }

        [HttpPost, Route("container")]
        public IActionResult UpdateContainer([FromBody] Container container)
        {
            var result = _containers.Update(container);

            return Ok(result);
        }

        [HttpPut, Route("transaction/pair")]
        public IActionResult CreateTransaction([FromBody] Transaction[] transactions)
        {
            if(transactions.Length != 2)
            {
                return BadRequest("only 2 transactions");
            }

            var id0 = ObjectId.NewObjectId();

            transactions[0]._id = id0;
            transactions[1].PairId = id0;

            var id1 = ObjectId.NewObjectId();

            transactions[1]._id = id1;
            transactions[0].PairId = id1;

            var result0 = _transactions.Insert(transactions[0]);
            var result1 = _transactions.Insert(transactions[1]);

            var results = new ObjectId[2] { result0, result1 };

            return Ok(results);
        }


        [HttpPut, Route("transaction")]
        public IActionResult CreateTransaction([FromBody] Transaction transaction)
        {
            var result = _transactions.Insert(transaction);

            return Ok(result);
        }


        [HttpPost, Route("transaction")]
        public IActionResult UpdateTransaction([FromBody] Transaction transaction)
        {
            var result = _transactions.Update(transaction);

            return Ok(result);
        }

        [HttpGet, Route("transaction")]
        public IActionResult GetTransaction()
        {
            var result = _transactions.Get(a => a._id != null);

            return Ok(result);
        }

        [HttpDelete, Route("transaction/{id}")]
        public IActionResult DeleteTransaction(ObjectId id)
        {
            var result = _transactions.Delete(id);

            return Ok(result);
        }



        //[HttpGet, Route("transaction/{id}")]
        //public IActionResult TransactionGet(ObjectId id)
        //{
        //    var result = _transactions.Get(a => a._id == id);

        //    //return Ok(result);
        //    return Ok(result);
        //}

        //[HttpPost, Route("transaction")]
        //public IActionResult TransactionPost ([FromBody] IEnumerable<Transaction> transactions)
        //{
        //    foreach (var transaction in transactions)
        //    {
        //        if (transaction._id != ObjectId.Empty && transaction._id != null)
        //        {
        //            _transactions.Update(transaction);
        //            //if (transaction.Amount == 0 && (transaction.PoolId == ObjectId.Empty || transaction.PoolId == null))
        //            //{
        //            //    _transactions.Delete(transaction._id);
        //            //}
        //            //else
        //            //{
        //            //    _transactions.Update(transaction);
        //            //}
        //        }
        //        else
        //        {
        //            _transactions.Insert(transaction);
        //        }
        //    }

        //    return Ok();
        //}




        //[HttpGet, Route("envelope/all")]
        //public IActionResult GetEnvelopes()
        //{
        //    return Ok(Enum.GetNames(typeof(Container)));
        //}

        //[HttpGet, Route("assignment/envelope/{envelope}")]
        //public IActionResult AssignmentGetByEnvelope(Container envelope)
        //{
        //    var result = _assignments.Get(a => a.Envelope == envelope);

        //    return Ok(result);
        //}

        //[HttpGet, Route("assignment/all")]
        //public IActionResult AssignmentGet()
        //{
        //    var result = _assignments.Get(a => a._id != null);

        //    return Ok(result);
        //}

        //[HttpGet, Route("assignment/pool/{poolId}")]
        //public IActionResult AssignmentGetByPoolId(ObjectId poolId)
        //{
        //    var result = _assignments.Get(a => a.PoolId == poolId);

        //    return Ok(result);
        //}

        //[HttpPost, Route("assignment/commit")]
        //public IActionResult AssignmentCommit([FromBody] IEnumerable<Assignment> assignments)
        //{
        //    foreach(var assignment in assignments)
        //    {
        //        if(assignment._id != ObjectId.Empty && assignment._id != null)
        //        {
        //            if (assignment.Amount == 0 && (assignment.PoolId == ObjectId.Empty || assignment.PoolId == null))
        //            {
        //                _assignments.Delete(assignment._id);
        //            }
        //            else
        //            {
        //                _assignments.Update(assignment);
        //            }
        //        }
        //        else
        //        {
        //            _assignments.Insert(assignment);
        //        }
        //    }

        //    return Ok();
        //}


        //[HttpPost, Route("pool/commit")]
        //public IActionResult PoolCommit([FromBody] Pool pool)
        //{
        //    if (pool.Date.Year != _settings.Year)
        //    {
        //        return BadRequest($"Configured for {_settings.Year}");
        //    }

        //    var matchByDate = _pools.Get(a => a.Date == pool.Date);

        //    if(matchByDate.Count() != 0)
        //    {
        //        if(matchByDate.First()._id != pool._id)
        //        {
        //            return BadRequest($"Multiple pools for {pool.Date}");
        //        }
        //    }

        //    if (_pools.Get(a => a._id == pool._id).Count() != 0)
        //    {
        //        _pools.Update(pool);
        //    }
        //    else
        //    {
        //        _pools.Insert(pool);
        //    }

        //    return Ok();
        //}

        //[HttpGet, Route("pool/{id}")]
        //public IActionResult PoolGet(ObjectId id)
        //{
        //    var result = _pools.Get(a => a._id == id).First();
        //    return Ok(result);
        //}

        //[HttpGet, Route("pool/all")]
        //public IActionResult PoolGetAll()
        //{
        //    var result = _pools.Get(a => a._id != null);

        //    return Ok(result);
        //}
    }
}

