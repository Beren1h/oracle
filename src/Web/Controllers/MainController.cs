using Microsoft.AspNetCore.Mvc;

namespace Web.Controllers
{
    [Route("main")]
    public class MainController : Controller
    {
        [Route("")]
        public IActionResult Index()
        {
            return View();
        }
    }
}