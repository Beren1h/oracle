using Microsoft.AspNetCore.Mvc;
using Frame.Collections;
using Frame.Models;
using Microsoft.Extensions.Options;
using LiteDB;

namespace Web.Controllers
{
    [Produces("application/json")]
    [Route("api")]
    public class ApiController : Controller
    {
        private readonly IDbCollection<Transaction> _transactions;
        private readonly IDbCollection<Container> _containers;
        private readonly IDbCollection<Dole> _doles;
        private readonly IDbCollection<Bill> _bills;
        private readonly AppSettings _settings;

        public ApiController(IDbCollection<Transaction> transactions,
            IDbCollection<Container> containers,
            IDbCollection<Dole> doles,
            IDbCollection<Bill> bills,
            IOptions<AppSettings> settings)
        {
            _transactions = transactions;
            _containers = containers;
            _doles = doles;
            _bills = bills;
            _settings = settings.Value;
        }

        [HttpGet, Route("objectid")]
        public IActionResult CreateObjectId()
        {
            return Ok(ObjectId.NewObjectId());
        }

        //container
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

        [HttpDelete, Route("container")]
        public IActionResult DeleteContainer()
        {
            foreach (var container in _containers.Get(a => a._id != null))
            {
                _containers.Delete(container._id);
            }

            return Ok(true);
        }

        //transaction
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

        [HttpDelete, Route("transaction/{id}")]
        public IActionResult DeleteTransaction(ObjectId id)
        {
            var result = _transactions.Delete(id);

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
        public IActionResult GetTransactionByDole(ObjectId id)
        {
            var result = _transactions.Get(a => a.DoleId == id);

            return Ok(result);
        }

        [HttpGet, Route("transaction/container/{id}")]
        public IActionResult GetTransactionByContainer(ObjectId id)
        {
            var result = _transactions.Get(a => a.ContainerId == id);

            return Ok(result);
        }

        // dole
        [HttpGet, Route("dole")]
        public IActionResult GetDole()
        {
            var result = _doles.Get(a => a._id != null);

            return Ok(result);
        }

        [HttpGet, Route("dole/{id}")]
        public IActionResult GetDoleById(ObjectId id)
        {
            var result = _doles.Get(a => a._id == id);

            return Ok(result);
        }

        [HttpDelete, Route("dole")]
        public IActionResult DeleteDole()
        {
            foreach(var dole in _doles.Get(a => a._id != null))
            {
                _doles.Delete(dole._id);
            }
                        
            return Ok(true);
        }

        [HttpPut, Route("dole")]
        public IActionResult PutDole([FromBody] Dole dole)
        {
            var result = _doles.Insert(dole);

            return Ok(result);
        }

        [HttpPost, Route("dole")]
        public IActionResult PostDole([FromBody] Dole dole)
        {
            var result = _doles.Update(dole);

            return Ok(result);
        }

        [HttpDelete, Route("transaction")]
        public IActionResult DeleteAllTransactions()
        {
            var transactions = _transactions.Get(a => a._id != null);
            
            foreach (var transaction in transactions)
            {
                _transactions.Delete(transaction._id);
            }

            return Ok(true);
        }

        // bills
        [HttpGet, Route("bill")]
        public IActionResult GetBill()
        {
            var result = _bills.Get(a => a._id != null);

            return Ok(result);
        }

        [HttpGet, Route("bill/{id}")]
        public IActionResult GetBillById(ObjectId id)
        {
            var result = _bills.Get(a => a._id == id);

            return Ok(result);
        }

        [HttpDelete, Route("bill")]
        public IActionResult DeleteBill()
        {
            foreach (var bill in _bills.Get(a => a._id != null))
            {
                _bills.Delete(bill._id);
            }

            return Ok(true);
        }

        [HttpPut, Route("bill")]
        public IActionResult PutBill([FromBody] Bill bill)
        {
            var result = _bills.Insert(bill);

            return Ok(result);
        }

        [HttpPost, Route("bill")]
        public IActionResult PostBill([FromBody] Bill bill)
        {
            var result = _bills.Update(bill);

            return Ok(result);
        }

    }
}

