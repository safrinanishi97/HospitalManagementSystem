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
    public class MedicineBillingDetailController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MedicineBillingDetailController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/MedicineBillingDetail
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MedicineBillingDetailDTO>>> GetMedicineBillingDetails()
        {
            var medicineBillingDetails = await _context.MedicineBillingDetails
                 .Include(mbd => mbd.MedicineBill) // Include MedicineBill
                .ToListAsync();
            return medicineBillingDetails.Select(mbd => new MedicineBillingDetailDTO
            {
                MedicineBillingDetailId = mbd.MedicineBillingDetailId,
                MedicineBillingId = mbd.MedicineBillingId,
                MedicineBillId = mbd.MedicineBillId,
                Price = mbd.Price,
                Quantity = mbd.Quantity,
                TotalPrice = mbd.TotalPrice,
                MedicineBill = new MedicineBillDTO
                {
                    MedicineBillId = mbd.MedicineBill.MedicineBillId,
                    MedicineName = mbd.MedicineBill.MedicineName,
                    Price = mbd.MedicineBill.Price
                }
            }).ToList();
        }

        // GET: api/MedicineBillingDetail/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MedicineBillingDetailDTO>> GetMedicineBillingDetail(int id)
        {
            var medicineBillingDetail = await _context.MedicineBillingDetails
                 .Include(mbd => mbd.MedicineBill) // Include MedicineBill
                .FirstOrDefaultAsync(mbd => mbd.MedicineBillingDetailId == id);

            if (medicineBillingDetail == null)
            {
                return NotFound();
            }
            return new MedicineBillingDetailDTO
            {
                MedicineBillingDetailId = medicineBillingDetail.MedicineBillingDetailId,
                MedicineBillingId = medicineBillingDetail.MedicineBillingId,
                MedicineBillId = medicineBillingDetail.MedicineBillId,
                Price = medicineBillingDetail.Price,
                Quantity = medicineBillingDetail.Quantity,
                TotalPrice = medicineBillingDetail.TotalPrice,
                MedicineBill = new MedicineBillDTO
                {
                    MedicineBillId = medicineBillingDetail.MedicineBill.MedicineBillId,
                    MedicineName = medicineBillingDetail.MedicineBill.MedicineName,
                    Price = medicineBillingDetail.MedicineBill.Price
                }
            };
        }

        // POST: api/MedicineBillingDetail
        [HttpPost]
        public async Task<ActionResult<MedicineBillingDetailDTO>> PostMedicineBillingDetail(CreateMedicineBillingDetailDTO createMedicineBillingDetailDTO, int medicineBillingId)
        {
            // Get the MedicineBilling to associate the detail with
            var medicineBilling = await _context.MedicineBillings.FindAsync(medicineBillingId);
            if (medicineBilling == null)
            {
                return BadRequest("MedicineBillingId is invalid."); // Or a 400 Bad Request
            }

            var medicineBillingDetail = new MedicineBillingDetail
            {
                MedicineBillingId = medicineBillingId, // Use the provided medicineBillingId
                MedicineBillId = createMedicineBillingDetailDTO.MedicineBillId,
                Price = createMedicineBillingDetailDTO.Price,
                Quantity = createMedicineBillingDetailDTO.Quantity,
                TotalPrice = createMedicineBillingDetailDTO.Price * createMedicineBillingDetailDTO.Quantity
            };

            _context.MedicineBillingDetails.Add(medicineBillingDetail);
            await _context.SaveChangesAsync();

            // Load the MedicineBill for the DTO response
            await _context.Entry(medicineBillingDetail).Reference(d => d.MedicineBill).LoadAsync();
            var medicineBillingDetailDTO = new MedicineBillingDetailDTO
            {
                MedicineBillingDetailId = medicineBillingDetail.MedicineBillingDetailId,
                MedicineBillingId = medicineBillingDetail.MedicineBillingId,
                MedicineBillId = medicineBillingDetail.MedicineBillId,
                Price = medicineBillingDetail.Price,
                Quantity = medicineBillingDetail.Quantity,
                TotalPrice = medicineBillingDetail.TotalPrice,
                MedicineBill = new MedicineBillDTO
                {
                    MedicineBillId = medicineBillingDetail.MedicineBill.MedicineBillId,
                    MedicineName = medicineBillingDetail.MedicineBill.MedicineName,
                    Price = medicineBillingDetail.MedicineBill.Price
                }
            };
            return CreatedAtAction(nameof(GetMedicineBillingDetail), new { id = medicineBillingDetail.MedicineBillingDetailId }, medicineBillingDetailDTO);
        }

        // PUT: api/MedicineBillingDetail/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMedicineBillingDetail(int id, UpdateMedicineBillingDetailDTO updateMedicineBillingDetailDTO)
        {
            if (id != updateMedicineBillingDetailDTO.MedicineBillingDetailId)
            {
                return BadRequest();
            }

            var medicineBillingDetail = await _context.MedicineBillingDetails.FindAsync(id);
            if (medicineBillingDetail == null)
            {
                return NotFound();
            }

            medicineBillingDetail.MedicineBillId = updateMedicineBillingDetailDTO.MedicineBillId;
            medicineBillingDetail.Price = updateMedicineBillingDetailDTO.Price;
            medicineBillingDetail.Quantity = updateMedicineBillingDetailDTO.Quantity;
            medicineBillingDetail.TotalPrice = updateMedicineBillingDetailDTO.Price * updateMedicineBillingDetailDTO.Quantity;

            _context.Entry(medicineBillingDetail).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MedicineBillingDetailExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            // Load the MedicineBill for the DTO response
            await _context.Entry(medicineBillingDetail).Reference(d => d.MedicineBill).LoadAsync();

            var medicineBillingDetailDTO = new MedicineBillingDetailDTO
            {
                MedicineBillingDetailId = medicineBillingDetail.MedicineBillingDetailId,
                MedicineBillingId = medicineBillingDetail.MedicineBillingId,
                MedicineBillId = medicineBillingDetail.MedicineBillId,
                Price = medicineBillingDetail.Price,
                Quantity = medicineBillingDetail.Quantity,
                TotalPrice = medicineBillingDetail.TotalPrice,
                MedicineBill = new MedicineBillDTO
                {
                    MedicineBillId = medicineBillingDetail.MedicineBill.MedicineBillId,
                    MedicineName = medicineBillingDetail.MedicineBill.MedicineName,
                    Price = medicineBillingDetail.MedicineBill.Price
                }
            };

            return Ok(medicineBillingDetailDTO);
        }

        // DELETE: api/MedicineBillingDetail/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMedicineBillingDetail(int id)
        {
            var medicineBillingDetail = await _context.MedicineBillingDetails.FindAsync(id);
            if (medicineBillingDetail == null)
            {
                return NotFound();
            }

            _context.MedicineBillingDetails.Remove(medicineBillingDetail);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MedicineBillingDetailExists(int id)
        {
            return _context.MedicineBillingDetails.Any(e => e.MedicineBillingDetailId == id);
        }
    }
}
