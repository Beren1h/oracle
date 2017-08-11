using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

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