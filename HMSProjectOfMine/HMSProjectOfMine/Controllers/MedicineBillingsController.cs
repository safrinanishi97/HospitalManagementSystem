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
    public class MedicineBillingController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MedicineBillingController(AppDbContext context)
        {
            _context = context;
        }

        // Helper method for mapping MedicineBilling to MedicineBillingDTO
        private MedicineBillingDTO MapToDTO(MedicineBilling medicineBilling)
        {
            if (medicineBilling == null)
                throw new ArgumentNullException(nameof(medicineBilling), "The medicine billing object is null.");

            return new MedicineBillingDTO
            {
                MedicineBillingId = medicineBilling.MedicineBillingId,
                BillNo = medicineBilling.BillNo,
                PatientId = medicineBilling.PatientId,
                RefBy = medicineBilling.RefBy,
                TotalAmount = medicineBilling.TotalAmount,
                DiscountAmount = medicineBilling.DiscountAmount,
                DiscountPercentage = medicineBilling.DiscountPercentage,
                PayableAmount = medicineBilling.PayableAmount,
                DueAmount = medicineBilling.DueAmount,
                PaidAmount = medicineBilling.PaidAmount,
                Patient = medicineBilling.Patient != null ? new PatientReadDto
                {
                    PatientId = medicineBilling.Patient.PatientId,
                    FirstName = medicineBilling.Patient.FirstName
                } : null,
                MedicineBillingDetails = medicineBilling.MedicineBillingDetails?.Select(detail => new MedicineBillingDetailDTO
                {
                    MedicineBillingDetailId = detail.MedicineBillingDetailId,
                    MedicineBillingId = detail.MedicineBillingId,
                    MedicineBillId = detail.MedicineBillId,
                    Price = detail.Price,
                    Quantity = detail.Quantity,
                    TotalPrice = detail.TotalPrice,
                    MedicineBill = detail.MedicineBill != null ? new MedicineBillDTO
                    {
                        MedicineBillId = detail.MedicineBill.MedicineBillId,
                        MedicineName = detail.MedicineBill.MedicineName,
                        Price = detail.MedicineBill.Price
                    } : null
                }).ToList() ?? new List<MedicineBillingDetailDTO>()
            };
        }

        // GET: api/MedicineBilling
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MedicineBillingListDTO>>> GetMedicineBillings()
        {
            var medicineBillings = await _context.MedicineBillings
                .Include(mb => mb.Patient)
                .ToListAsync();

            var result = medicineBillings.Select(mb => new MedicineBillingListDTO
            {
                MedicineBillingId = mb.MedicineBillingId,
                BillNo = mb.BillNo,
                PatientId = mb.PatientId,
                RefBy = mb.RefBy,
                TotalAmount = mb.TotalAmount,
                PayableAmount = mb.PayableAmount,
                DueAmount = mb.DueAmount,
                DeliveryDate = mb.DeliveryDate,
                DeliveryTime = mb.DeliveryTime,
                PatientName = mb.Patient?.FirstName // Add null check for Patient
            }).ToList();

            return Ok(result);
        }

        // GET: api/MedicineBilling/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MedicineBillingDTO>> GetMedicineBilling(int id)
        {
            var medicineBilling = await _context.MedicineBillings
                .Include(mb => mb.Patient)
                .Include(mb => mb.MedicineBillingDetails)
                    .ThenInclude(mbd => mbd.MedicineBill)
                .FirstOrDefaultAsync(mb => mb.MedicineBillingId == id);

            if (medicineBilling == null)
            {
                return NotFound();
            }

            return Ok(MapToDTO(medicineBilling));
        }

        // POST: api/MedicineBilling
        [HttpPost]
        public async Task<ActionResult<MedicineBillingDTO>> PostMedicineBilling(CreateMedicineBillingDTO createMedicineBillingDTO)
        {
            if (createMedicineBillingDTO == null)
            {
                return BadRequest("Invalid data.");
            }

            var medicineBilling = new MedicineBilling
            {
                BillNo = createMedicineBillingDTO.BillNo,
                PatientId = createMedicineBillingDTO.PatientId,
                RefBy = createMedicineBillingDTO.RefBy,
                TotalAmount = createMedicineBillingDTO.TotalAmount,
                DiscountAmount = createMedicineBillingDTO.DiscountAmount,
                DiscountPercentage = createMedicineBillingDTO.DiscountPercentage,
                DeliveryDate = createMedicineBillingDTO.DeliveryDate,
                DeliveryTime = createMedicineBillingDTO.DeliveryTime,
                PaidAmount = createMedicineBillingDTO.PaidAmount,
                MedicineBillingDetails = createMedicineBillingDTO.MedicineBillingDetails?.Select(detailDTO => new MedicineBillingDetail
                {
                    MedicineBillId = detailDTO.MedicineBillId,
                    Price = detailDTO.Price,
                    Quantity = detailDTO.Quantity,
                    TotalPrice = detailDTO.Price * detailDTO.Quantity
                }).ToList() ?? new List<MedicineBillingDetail>()
            };

            // Calculate PayableAmount and DueAmount
            medicineBilling.PayableAmount = medicineBilling.TotalAmount - medicineBilling.DiscountAmount;
            medicineBilling.DueAmount = medicineBilling.PayableAmount - medicineBilling.PaidAmount;

            _context.MedicineBillings.Add(medicineBilling);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMedicineBilling), new { id = medicineBilling.MedicineBillingId }, MapToDTO(medicineBilling));
        }

        // PUT: api/MedicineBilling/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMedicineBilling(int id, UpdateMedicineBillingDTO updateMedicineBillingDTO)
        {
            if (id != updateMedicineBillingDTO.MedicineBillingId)
            {
                return BadRequest();
            }

            var medicineBilling = await _context.MedicineBillings
                .Include(mb => mb.MedicineBillingDetails)
                .FirstOrDefaultAsync(mb => mb.MedicineBillingId == id);

            if (medicineBilling == null)
            {
                return NotFound();
            }

            // Update the main MedicineBilling properties
            medicineBilling.BillNo = updateMedicineBillingDTO.BillNo;
            medicineBilling.PatientId = updateMedicineBillingDTO.PatientId;
            medicineBilling.RefBy = updateMedicineBillingDTO.RefBy;
            medicineBilling.TotalAmount = updateMedicineBillingDTO.TotalAmount;
            medicineBilling.DiscountAmount = updateMedicineBillingDTO.DiscountAmount;
            medicineBilling.DiscountPercentage = updateMedicineBillingDTO.DiscountPercentage;
            medicineBilling.DeliveryDate = updateMedicineBillingDTO.DeliveryDate;
            medicineBilling.DeliveryTime = updateMedicineBillingDTO.DeliveryTime;
            medicineBilling.PaidAmount = updateMedicineBillingDTO.PaidAmount;

            // Calculate PayableAmount and DueAmount
            medicineBilling.PayableAmount = medicineBilling.TotalAmount - medicineBilling.DiscountAmount;
            medicineBilling.DueAmount = medicineBilling.PayableAmount - medicineBilling.PaidAmount;

            // Update MedicineBillingDetails (add, update or remove as necessary)
            var existingDetailIds = medicineBilling.MedicineBillingDetails.Select(d => d.MedicineBillingDetailId).ToList();
            var updatedDetailIds = updateMedicineBillingDTO.MedicineBillingDetails.Select(d => d.MedicineBillingDetailId).ToList();
            var detailsToRemove = existingDetailIds.Except(updatedDetailIds).ToList();
            foreach (var detailId in detailsToRemove)
            {
                var detailToRemove = medicineBilling.MedicineBillingDetails.FirstOrDefault(d => d.MedicineBillingDetailId == detailId);
                if (detailToRemove != null)
                {
                    _context.MedicineBillingDetails.Remove(detailToRemove);
                }
            }

            // Update existing details and add new ones
            foreach (var detailDTO in updateMedicineBillingDTO.MedicineBillingDetails)
            {
                var existingDetail = medicineBilling.MedicineBillingDetails.FirstOrDefault(d => d.MedicineBillingDetailId == detailDTO.MedicineBillingDetailId);
                if (existingDetail != null)
                {
                    existingDetail.MedicineBillId = detailDTO.MedicineBillId;
                    existingDetail.Price = detailDTO.Price;
                    existingDetail.Quantity = detailDTO.Quantity;
                    existingDetail.TotalPrice = detailDTO.Price * detailDTO.Quantity;
                }
                else
                {
                    var newDetail = new MedicineBillingDetail
                    {
                        MedicineBillId = detailDTO.MedicineBillId,
                        Price = detailDTO.Price,
                        Quantity = detailDTO.Quantity,
                        TotalPrice = detailDTO.Price * detailDTO.Quantity
                    };
                    medicineBilling.MedicineBillingDetails.Add(newDetail);
                    _context.MedicineBillingDetails.Add(newDetail);
                }
            }

            _context.Entry(medicineBilling).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MedicineBillingExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(MapToDTO(medicineBilling));
        }

        // DELETE: api/MedicineBilling/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMedicineBilling(int id)
        {
            var medicineBilling = await _context.MedicineBillings.FindAsync(id);
            if (medicineBilling == null)
            {
                return NotFound();
            }

            _context.MedicineBillings.Remove(medicineBilling);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MedicineBillingExists(int id)
        {
            return _context.MedicineBillings.Any(e => e.MedicineBillingId == id);
        }
    }
}
