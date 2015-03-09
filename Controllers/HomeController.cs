using DataAccessLayer;
using GoalTracking.Models;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace GoalTracking.Controllers
{   
    public class HomeController : Controller
    {
        GTContext db = new GTContext();
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Tasks(long? id)
        {
            employeeDetail employeeDetailEntity = (from ed in db.employeeDetails
                                  where (ed.IsDeleted ?? false) == false && ed.ID == id
                                  select ed).FirstOrDefault();
            return View(employeeDetailEntity);
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}