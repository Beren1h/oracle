using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Frame.Models;

namespace Web.Controllers
{
    [Route("oracle")]
    public class OracleController : Controller
    {
        private readonly AppSettings _settings;

        public OracleController(IOptions<AppSettings> settings)
        {
            _settings = settings.Value;
        }

        [Route("test")]
        public IActionResult Test()
        {
            var x = new Transaction
            {
                Date = DateTime.Now,
                Account = Account.wellsfargo,
                Amount = 100.40m,
                //Envelope = null
            };

            return Ok(x);
        }

        [HttpPost]
        [Route("in")]
        public IActionResult In([FromBody] Transaction t)
        {
            return Ok(t);
        }

        [Route("pools")]
        public IActionResult Pools()
        {
            ViewBag.Year = _settings.Year;

            return View();
        }

        [Route("assignments")]
        public IActionResult Assignments()
        {
            ViewBag.Year = _settings.Year;

            return View();
        }
    }
}