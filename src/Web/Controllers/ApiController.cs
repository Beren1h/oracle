using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Frame.Collections;
using Frame.Models;
using System.Linq.Expressions;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
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

        [HttpPost, Route("pool/insert")]
        public IActionResult InsertPool([FromBody] Pool pool)
        {
            if(pool.Date.Year != _settings.Year)
            {
                return BadRequest($"Configured for {_settings.Year}");
            }
            
            Expression<Func<Pool, bool>> q = a => a.Date == pool.Date;

            if(_pools.Get(q).Count() != 0)
            {
                return BadRequest($"Pool already exists for {pool.Date.Display()}");
            }

            _pools.Insert(pool);

            return Ok();
        }

        [HttpPost, Route("pool/test")]
        public IActionResult GetOnePool(ObjectId id)
        {
            Expression<Func<Pool, bool>> q = a => a._id != id;

            var result = _pools.Get(q).ToList();

            return Ok(result);

        }

        [HttpGet, Route("pool/get")]
        public IActionResult GetPools()
        {
            Expression<Func<Pool, bool>> q = a => a._id != null;

            var result = _pools.Get(q).ToList();

            //foreach(var item in result)
            //{
            //    item.x = item._id.ToString();
            //}

            //var test = JsonConvert.SerializeObject(result);

            return Ok(result.ToList());

        }

        [Route("test")]
        public IActionResult Test()
        {
            Expression<Func<Assignment, bool>> q = a => a.IsPoolDebit == true && a.Envelope == Envelope.cable;

            var x = _assignments.Get(q).ToList();

            return Ok("abc");
        }

    }
}