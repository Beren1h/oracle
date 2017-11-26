using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Frame.Models;
using LiteDB;
using Frame.Collections;

namespace Web.Controllers
{
    [Route("oracle")]
    public class OracleController : Controller
    {
        private readonly AppSettings _settings;
        private readonly IDbCollection<Container> _containers;


        public OracleController(IOptions<AppSettings> settings, IDbCollection<Container> containers)
        {
            _settings = settings.Value;
            _containers = containers;
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

            var container = _containers.Get(c => c._id == containerId);

            ViewBag.Year = _settings.Year;
            ViewBag.Version = _settings.Version;
            ViewBag.ContainerId = containerId;
            ViewBag.DoleId = doleId;
            ViewBag.Name = container.FirstOrDefault().Name;

            return View();
        }

        [Route("account/{id}")]
        public IActionResult Account(ObjectId id)
        {
            var container = _containers.Get(c => c._id == id);

            ViewBag.Year = _settings.Year;
            ViewBag.Version = _settings.Version;
            ViewBag.ContainerId = id;
            ViewBag.Name = container.FirstOrDefault().Name;

            return View();
        }

        [Route("envelope/{containerId}")]
        public IActionResult Envelope(ObjectId containerId)
        {
            var container = _containers.Get(c => c._id == containerId);

            ViewBag.Year = _settings.Year;
            ViewBag.Version = _settings.Version;
            ViewBag.ContainerId = containerId;
            ViewBag.Name = container.FirstOrDefault().Name;

            return View();
        }

        [Route("dash")]
        public IActionResult Dash()
        {
            ViewBag.Year = _settings.Year;
            ViewBag.Version = _settings.Version;

            return View();
        }

        [Route("schedule")]
        public IActionResult Schedule()
        {
            ViewBag.Year = _settings.Year;

            return View();
        }
    }
}