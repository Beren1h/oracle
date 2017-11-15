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
        private readonly IDbCollection<Transaction> _transactions;
        private readonly IDbCollection<Container> _containers;
        private readonly IDbCollection<Dole> _doles;
        private readonly AppSettings _settings;

        public ApiController(IDbCollection<Transaction> transactions,
            IDbCollection<Container> containers,
            IDbCollection<Dole> doles,
            IOptions<AppSettings> settings)
        {
            _transactions = transactions;
            _containers = containers;
            _doles = doles;
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


        [HttpPost, Route("transaction/pair")]
        public IActionResult UpdateTransactionPair([FromBody] Transaction[] transactions)
        {
            if (transactions.Length != 2)
            {
                return BadRequest("only 2 transactions");
            }

            var result0 = _transactions.Update(transactions[0]);
            var result1 = _transactions.Update(transactions[1]);

            return Ok(result0 && result1);
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

        [HttpGet, Route("transaction/{id}")]
        public IActionResult GetTransactionById(ObjectId id)
        {
            var result = _transactions.Get(a => a._id == id);

            return Ok(result);
        }

        [HttpGet, Route("transaction/dole/{id}")]
        public IActionResult GetTransactionByQuery(ObjectId id)
        {
            var result = _transactions.Get(a => a.DoleId == id);

            return Ok(result);
        }

        [HttpGet, Route("dole/{id}")]
        public IActionResult GetDolw(ObjectId id)
        {
            var result = _doles.Get(a => a._id == id);

            return Ok(result);
        }

        [HttpPut, Route("dole")]
        public IActionResult GetDole([FromBody] Dole dole)
        {
            var result = _doles.Insert(dole);

            return Ok(result);
        }

        [HttpGet]

        [HttpDelete, Route("transaction/{id}")]
        public IActionResult DeleteTransaction(ObjectId id)
        {
            var result = _transactions.Delete(id);

            return Ok(result);
        }

        [HttpDelete, Route("transaction/pair/{id0}/{id1}")]
        public IActionResult DeleteTransactionPair(ObjectId id0, ObjectId id1)
        {
            var result0 = _transactions.Delete(id0);
            var result1 = _transactions.Delete(id1);

            return Ok(result0 && result1);
        }

        [HttpDelete, Route("transaction")]
        public IActionResult DeleteAllTransactions()
        {
            //var id = new ObjectId("59ff380c830ee103e8d05e45");
            var id = new ObjectId("5a0ad8263450d303e8b1b7bd");

            var transactions = _transactions.Get(a => a._id != id);
            
            foreach (var transaction in transactions)
            {
                _transactions.Delete(transaction._id);
            }

            return Ok(true);
        }
    }
}

