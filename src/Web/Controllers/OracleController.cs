using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Frame.Models;
using LiteDB;

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

        //[Route("test")]
        //public IActionResult Test()
        //{
        //    var x = new Transaction
        //    {
        //        Date = DateTime.Now,
        //        Account = Account.wellsfargo,
        //        Amount = 100.40m,
        //        //Envelope = null
        //    };

        //    return Ok(x);
        //}

        //[HttpPost]
        //[Route("in")]
        //public IActionResult In([FromBody] Transaction t)
        //{
        //    return Ok(t);
        //}

        [Route("accounts")]
        public IActionResult Accounts()
        {
            ViewBag.Year = _settings.Year;
            ViewBag.Version = _settings.Version;

            return View();
        }

        [Route("dole/{containerId}")]
        public IActionResult Dole(ObjectId doleId, ObjectId containerId)
        {
            if (doleId == ObjectId.Empty)
            {
                doleId = ObjectId.NewObjectId();
            }

            ViewBag.Year = _settings.Year;
            ViewBag.Version = _settings.Version;
            ViewBag.ContainerId = containerId;
            ViewBag.DoleId = doleId;

            return View();
        }

        [Route("account/{id}")]
        public IActionResult Account(ObjectId id)
        {
            ViewBag.Year = _settings.Year;
            ViewBag.Version = _settings.Version;
            ViewBag.ContainerId = id;

            return View();
        }

        [Route("envelope/{containerId}")]
        public IActionResult Envelope(ObjectId containerId)
        {
            ViewBag.Year = _settings.Year;
            ViewBag.Version = _settings.Version;
            ViewBag.ContainerId = containerId;

            return View();
        }

    }
}