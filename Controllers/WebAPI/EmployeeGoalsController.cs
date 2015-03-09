using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using DataAccessLayer;
using GoalTracking.Models;

namespace GoalTracking.Controllers.WebAPI
{
    public class EmployeeGoalsController : ApiController
    {
        private GTContext db = new GTContext();

        // GET: api/EmployeeGoals
        public IQueryable<employeeGoal> GetemployeeGoals()
        {
            return db.employeeGoals;
        }

        // GET: api/EmployeeGoals/5
        [ResponseType(typeof(List<employeeGoal>))]
        public async Task<IHttpActionResult> GetemployeeGoal(int id)
        {
            List<employeeGoal> employeeGoals = await (from eg in db.employeeGoals
                                                      where eg.EmployeeDetailID == id && (eg.IsDeleted ?? false) == false
                                                      select eg).ToListAsync();
            if (employeeGoals == null || employeeGoals.Count == 0)
            {
                return NotFound();
            }

            return Ok(employeeGoals);
        }

        // PUT: api/EmployeeGoals/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutemployeeGoal(int id, employeeGoal employeeGoal)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != employeeGoal.Id)
            {
                return BadRequest();
            }

            db.Entry(employeeGoal).State = System.Data.Entity.EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!employeeGoalExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/EmployeeGoals
        [ResponseType(typeof(employeeGoal))]
        public async Task<IHttpActionResult> PostemployeeGoal(employeeGoal employeeGoal)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.employeeGoals.Add(employeeGoal);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = employeeGoal.Id }, employeeGoal);
        }

        // DELETE: api/EmployeeGoals/5
        [ResponseType(typeof(employeeGoal))]
        public async Task<IHttpActionResult> DeleteemployeeGoal(int id)
        {
            employeeGoal employeeGoal = await db.employeeGoals.FindAsync(id);
            if (employeeGoal == null)
            {
                return NotFound();
            }

            employeeGoal.IsDeleted = true;
            await db.SaveChangesAsync();

            return Ok(employeeGoal);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool employeeGoalExists(int id)
        {
            return db.employeeGoals.Count(e => e.Id == id) > 0;
        }
    }
}