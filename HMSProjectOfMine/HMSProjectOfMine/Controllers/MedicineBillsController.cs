using HMSProjectOfMine.Data;
using HMSProjectOfMine.DTOs;
using HMSProjectOfMine.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HMSProjectOfMine.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MedicineBillController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MedicineBillController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/MedicineBill
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MedicineBillDTO>>> GetMedicineBills()
        {
            var medicineBills = await _context.MedicineBills.ToListAsync();
            return medicineBills.Select(mb => new MedicineBillDTO
            {
                MedicineBillId = mb.MedicineBillId,
                MedicineName = mb.MedicineName,
                Price = mb.Price
            }).ToList();
        }

        // GET: api/MedicineBill/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MedicineBillDTO>> GetMedicineBill(int id)
        {
            var medicineBill = await _context.MedicineBills.FindAsync(id);

            if (medicineBill == null)
            {
                return NotFound();
            }

            return new MedicineBillDTO
            {
                MedicineBillId = medicineBill.MedicineBillId,
                MedicineName = medicineBill.MedicineName,
                Price = medicineBill.Price
            };
        }

        // POST: api/MedicineBill
        [HttpPost]
        public async Task<ActionResult<MedicineBillDTO>> PostMedicineBill(CreateMedicineBillDTO createMedicineBillDTO)
        {
            var medicineBill = new MedicineBill
            {
                MedicineName = createMedicineBillDTO.MedicineName,
                Price = createMedicineBillDTO.Price
            };

            _context.MedicineBills.Add(medicineBill);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMedicineBill), new { id = medicineBill.MedicineBillId }, new MedicineBillDTO
            {
                MedicineBillId = medicineBill.MedicineBillId,
                MedicineName = medicineBill.MedicineName,
                Price = medicineBill.Price
            });
        }

        // PUT: api/MedicineBill/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMedicineBill(int id, UpdateMedicineBillDTO updateMedicineBillDTO)
        {
            if (id != updateMedicineBillDTO.MedicineBillId)
            {
                return BadRequest();
            }

            var medicineBill = await _context.MedicineBills.FindAsync(id);
            if (medicineBill == null)
            {
                return NotFound();
            }

            medicineBill.MedicineName = updateMedicineBillDTO.MedicineName;
            medicineBill.Price = updateMedicineBillDTO.Price;


            _context.Entry(medicineBill).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MedicineBillExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/MedicineBill/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMedicineBill(int id)
        {
            var medicineBill = await _context.MedicineBills.FindAsync(id);
            if (medicineBill == null)
            {
                return NotFound();
            }

            _context.MedicineBills.Remove(medicineBill);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MedicineBillExists(int id)
        {
            return _context.MedicineBills.Any(e => e.MedicineBillId == id);
        }
    }
}
