using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Frame.Collections;
using Frame.Models;
using System.Linq.Expressions;
using Microsoft.Extensions.Options;
using LiteDB;

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
            return Ok(Frame.Resources.Database.Envelopes);
        }




        [HttpPost, Route("pool/commit")]
        public IActionResult PoolHandler([FromBody] Pool pool)
        {
            if (pool.Date.Year != _settings.Year)
            {
                return BadRequest($"Configured for {_settings.Year}");
            }

            Expression<Func<Pool, bool>> q = a => a._id == pool._id;

            if (_pools.Get(q).Count() != 0)
            {
                _pools.Update(pool);
            }
            else
            {
                _pools.Insert(pool);
            }

            return Ok();
        }


        //[HttpPost, Route("pool/insert")]
        //public IActionResult InsertPool([FromBody] Pool pool)
        //{
        //    if(pool.Date.Year != _settings.Year)
        //    {
        //        return BadRequest($"Configured for {_settings.Year}");
        //    }
            
        //    Expression<Func<Pool, bool>> q = a => a.Date == pool.Date;

        //    if(_pools.Get(q).Count() != 0)
        //    {
        //        return BadRequest($"Pool already exists for {pool.Date.Display()}");
        //    }

        //    _pools.Insert(pool);

        //    return Ok();
        //}

        [HttpGet, Route("pool/{id}")]
        public IActionResult GetPools(string id)
        {
            Expression<Func<Pool, bool>> q = a => a._id == new ObjectId(id);

            var result = _pools.Get(q).First();

            return Ok(result);
        }

        [HttpGet, Route("pool/all")]
        public IActionResult GetPools()
        {
            Expression<Func<Pool, bool>> q = a => a._id != null;

            var result = _pools.Get(q).ToList();

            return Ok(result.ToList());
        }
    }
}