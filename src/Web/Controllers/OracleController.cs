using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Web.Controllers
{
    [Route("oracle")]
    public class OracleController : Controller
    {
        [Route("pools")]
        public IActionResult Pools()
        {
            return View();
        }

        [Route("assignments")]
        public IActionResult Assignments()
        {
            return View();
        }
    }
}