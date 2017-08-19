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
        private readonly IDbCollection<Pool> _pools;
        private readonly IDbCollection<Assignment> _assignments;

        private readonly AppSettings _settings;

        public ApiController(IDbCollection<Pool> pools, IDbCollection<Assignment> assignments, IOptions<AppSettings> settings)
        {
            _pools = pools;
            _assignments = assignments;
            _settings = settings.Value;
        }
        
        [HttpGet, Route("envelope/all")]
        public IActionResult GetEnvelopes()
        {
            return Ok(Enum.GetNames(typeof(Envelope)));
        }

        [HttpGet, Route("assignment/envelope/{envelope}")]
        public IActionResult AssignmentGetByEnvelope(Envelope envelope)
        {
            var result = _assignments.Get(a => a.Envelope == envelope);

            return Ok(result);
        }

        [HttpGet, Route("assignment/all")]
        public IActionResult AssignmentGet()
        {
            var result = _assignments.Get(a => a._id != null);

            return Ok(result);
        }

        [HttpGet, Route("assignment/pool/{poolId}")]
        public IActionResult AssignmentGetByPoolId(ObjectId poolId)
        {
            var result = _assignments.Get(a => a.PoolId == poolId);

            return Ok(result);
        }

        [HttpPost, Route("assignment/commit")]
        public IActionResult AssignmentCommit([FromBody] IEnumerable<Assignment> assignments)
        {
            foreach(var assignment in assignments)
            {
                if(assignment._id != ObjectId.Empty && assignment._id != null)
                {
                    if (assignment.Amount == 0 && (assignment.PoolId == ObjectId.Empty || assignment.PoolId == null))
                    {
                        _assignments.Delete(assignment._id);
                    }
                    else
                    {
                        _assignments.Update(assignment);
                    }
                }
                else
                {
                    _assignments.Insert(assignment);
                }
            }

            return Ok();
        }


        [HttpPost, Route("pool/commit")]
        public IActionResult PoolCommit([FromBody] Pool pool)
        {
            if (pool.Date.Year != _settings.Year)
            {
                return BadRequest($"Configured for {_settings.Year}");
            }

            var matchByDate = _pools.Get(a => a.Date == pool.Date);

            if(matchByDate.Count() != 0)
            {
                if(matchByDate.First()._id != pool._id)
                {
                    return BadRequest($"Multiple pools for {pool.Date}");
                }
            }

            if (_pools.Get(a => a._id == pool._id).Count() != 0)
            {
                _pools.Update(pool);
            }
            else
            {
                _pools.Insert(pool);
            }

            return Ok();
        }

        [HttpGet, Route("pool/{id}")]
        public IActionResult PoolGet(ObjectId id)
        {
            var result = _pools.Get(a => a._id == id).First();
            return Ok(result);
        }

        [HttpGet, Route("pool/all")]
        public IActionResult PoolGetAll()
        {
            var result = _pools.Get(a => a._id != null);

            return Ok(result);
        }
    }
}
