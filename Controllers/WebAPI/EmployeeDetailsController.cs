using System;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using DataAccessLayer;
using GoalTracking.Models;
using System.Data.Entity.Infrastructure;

namespace GoalTracking.Controllers.WebAPI
{
    public class EmployeeDetailsController : ApiController
    {
        private GTContext db = new GTContext();

        // GET: api/EmployeeDetails
        public IQueryable<employeeDetail> GetemployeeDetails()
        {
            return (from ed in db.employeeDetails
                    where (ed.IsDeleted ?? false) == false
                    orderby ed.ID descending
                    select ed);
        }

        // GET: api/EmployeeDetails/5
        [ResponseType(typeof(employeeDetail))]
        public async Task<IHttpActionResult> GetemployeeDetail(long id)
        {
            employeeDetail employeeDetail = await db.employeeDetails.FindAsync(id);
            if (employeeDetail == null)
            {
                return NotFound();
            }

            return Ok(employeeDetail);
        }

        // PUT: api/EmployeeDetails/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutemployeeDetail(long id, employeeDetail employeeDetail)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != employeeDetail.ID)
            {
                return BadRequest();
            }

            employeeDetail.ModifiedBy = "Admin";
            employeeDetail.ModifiedDate = DateTime.Now;
            db.Entry(employeeDetail).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch(DbUpdateConcurrencyException)
            {
                if (!employeeDetailExists(id))
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

        // POST: api/EmployeeDetails
        [ResponseType(typeof(employeeDetail))]
        public async Task<IHttpActionResult> PostemployeeDetail(employeeDetail employeeDetail)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }           

            db.employeeDetails.Add(employeeDetail);

            try
            {
                await db.SaveChangesAsync();
            }
            catch(Exception ex)
            {

            }
            //catch (DbUpdateException)
            //{
            //    if (employeeDetailExists(employeeDetail.ID))
            //    {
            //        return Conflict();
            //    }
            //    else
            //    {
            //        throw;
            //    }
            //}

            return CreatedAtRoute("DefaultApi", new { id = employeeDetail.ID }, employeeDetail);
        }

        // DELETE: api/EmployeeDetails/5
        [ResponseType(typeof(employeeDetail))]
        public async Task<IHttpActionResult> DeleteemployeeDetail(long id)
        {
            employeeDetail employeeDetail = await db.employeeDetails.FindAsync(id);
            if (employeeDetail == null)
            {
                return NotFound();
            }

            employeeDetail.IsDeleted = true;
            await db.SaveChangesAsync();

            return Ok(employeeDetail);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool employeeDetailExists(long id)
        {
            return db.employeeDetails.Count(e => e.ID == id) > 0;
        }
    }
}