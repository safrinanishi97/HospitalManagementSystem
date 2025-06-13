using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HMSProjectOfMine.DTOs;
using HMSProjectOfMine.Models;
using HMSProjectOfMine.Data;

namespace HMSProjectOfMine.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PrescriptionsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PrescriptionsController(AppDbContext context)
        {
            _context = context;
        }

        // Helper method for mapping Prescription to PrescriptionDTO
        private PrescriptionDTO MapToDTO(Prescription p)
        {
            return new PrescriptionDTO
            {
                PrescriptionId = p.PrescriptionId,
                PrescriptionNo = p.PrescriptionNo,
                TokenId = p.TokenId,
                TokenNumber = p.Token.TokenNumber,
                DoctorId = p.DoctorId,
                FirstName = p.Doctor.FirstName,
                LastName = p.Doctor.LastName,
                PrescriptionDate = p.PrescriptionDate,
                NextVisitDate = p.NextVisitDate,
                Assessment = p.Assessment,
                PrescriptionMedicines = p.PrescriptionMedicines.Select(pm => new PrescriptionMedicineDTO
                {
                    PrescriptionMedicineId = pm.PrescriptionMedicineId,

                    MedicineId = pm.MedicineId,
                    MedicineName = pm.Medicine.MedicineName,
                    Dosage = pm.Dosage,
                    Frequency = pm.Frequency,
                    Duration = pm.Duration
                }).ToList(),
                PrescriptionTests = p.PrescriptionTests.Select(pt => new PrescriptionTestDTO
                {
                    PrescriptionTestId = pt.PrescriptionTestId,

                    TestId = pt.TestId,
                    TestName = pt.Test.TestName
                }).ToList(),
                PrescriptionDiagnoses = p.PrescriptionDiagnoses.Select(pd => new PrescriptionDiagnosisDTO
                {
                    PrescriptionDiagnosisId = pd.PrescriptionDiagnosisId,

                    DiagnosisTitle = pd.DiagnosisTitle
                }).ToList(),
                PhysicalSymptoms = p.PhysicalSymptoms.Select(ps => new PhysicalSymptomDTO
                {
                    PhysicalSymptomId = ps.PhysicalSymptomId,

                    SymptomDescription = ps.SymptomDescription
                }).ToList(),
                PrescriptionAdvices = p.PrescriptionAdvices.Select(pa => new PrescriptionAdviceDTO
                {
                    PrescriptionAdviceId = pa.PrescriptionAdviceId,

                    Advice = pa.Advice
                }).ToList()
            };
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PrescriptionDTO>>> GetPrescriptions()
        {
            var prescriptions = await _context.Prescriptions
                .Include(p => p.Doctor)
                .Include(p => p.Token)
                .Include(p => p.PrescriptionMedicines).ThenInclude(pm => pm.Medicine)
                .Include(p => p.PrescriptionTests).ThenInclude(pt => pt.Test)
                .Include(p => p.PrescriptionDiagnoses)
                .Include(p => p.PhysicalSymptoms)
                .Include(p => p.PrescriptionAdvices)
                .ToListAsync();

            return prescriptions.Select(p => MapToDTO(p)).ToList();
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<PrescriptionDTO>> GetPrescriptionById(int id)
        {
            var prescription = await _context.Prescriptions
                .Include(p => p.Token)
                .Include(p => p.Doctor)
                .Include(p => p.PrescriptionMedicines).ThenInclude(m => m.Medicine)
                .Include(p => p.PrescriptionTests).ThenInclude(t => t.Test)
                .Include(p => p.PrescriptionDiagnoses)
                .Include(p => p.PhysicalSymptoms)
                .Include(p => p.PrescriptionAdvices)
                .FirstOrDefaultAsync(p => p.PrescriptionId == id);

            if (prescription == null)
                return NotFound();

            var dto = new PrescriptionDTO
            {
                PrescriptionId = prescription.PrescriptionId,
                PrescriptionNo = prescription.PrescriptionNo,
                TokenId = prescription.TokenId,
                TokenNumber = prescription.Token.TokenNumber,
                DoctorId = prescription.DoctorId,
                FirstName = prescription.Doctor.FirstName,
                LastName = prescription.Doctor.LastName,
                PrescriptionDate = prescription.PrescriptionDate,
                NextVisitDate = prescription.NextVisitDate,
                Assessment = prescription.Assessment,
                PrescriptionMedicines = prescription.PrescriptionMedicines.Select(m => new PrescriptionMedicineDTO
                {
                    PrescriptionMedicineId = m.PrescriptionMedicineId,
                    MedicineId = m.MedicineId,
                    MedicineName = m.Medicine.MedicineName,
                    Dosage = m.Dosage,
                    Frequency = m.Frequency,
                    Duration = m.Duration
                }).ToList(),
                PrescriptionTests = prescription.PrescriptionTests.Select(t => new PrescriptionTestDTO
                {
                    PrescriptionTestId = t.PrescriptionTestId,
                    TestId = t.TestId,
                    TestName = t.Test.TestName
                }).ToList(),
                PrescriptionDiagnoses = prescription.PrescriptionDiagnoses.Select(d => new PrescriptionDiagnosisDTO
                {
                    PrescriptionDiagnosisId = d.PrescriptionDiagnosisId,
                    DiagnosisTitle = d.DiagnosisTitle
                }).ToList(),
                PhysicalSymptoms = prescription.PhysicalSymptoms.Select(s => new PhysicalSymptomDTO
                {
                    PhysicalSymptomId = s.PhysicalSymptomId,
                    SymptomDescription = s.SymptomDescription
                }).ToList(),
                PrescriptionAdvices = prescription.PrescriptionAdvices.Select(a => new PrescriptionAdviceDTO
                {
                    PrescriptionAdviceId = a.PrescriptionAdviceId,
                    Advice = a.Advice
                }).ToList()
            };

            return Ok(dto);
        }


        [HttpGet("form-data")]
        public async Task<ActionResult<object>> GetFormData()
        {
            var doctors = await _context.Doctors
                .Select(d => new {
                    value = d.DoctorId,
                    label = d.FirstName + " " + d.LastName
                }).ToListAsync();

            var tokens = await _context.Tokens
                .Where(t => !_context.Prescriptions.Any(p => p.TokenId == t.TokenId))
                .Select(t => new {
                    value = t.TokenId,
                    label = t.TokenNumber
                }).ToListAsync();

            var tests = await _context.Tests
                .Select(t => new {
                    value = t.TestId,
                    label = t.TestName
                }).ToListAsync();

            var medicines = await _context.Medicines
                .Select(m => new {
                    value = m.MedicineId,
                    label = m.MedicineName
                }).ToListAsync();

            return new { doctors, tokens, tests, medicines };
        }

        [HttpPost]
        public async Task<ActionResult<PrescriptionDTO>> CreatePrescription([FromBody] CreatePrescriptionDTO dto)
        {
            if (!ModelState.IsValid)
            {
                // Log validation errors
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage);
                Console.WriteLine($"Validation errors: {string.Join(", ", errors)}");

                return BadRequest(ModelState);
            }

            var prescription = new Prescription
            {
                PrescriptionNo = dto.PrescriptionNo,
                TokenId = dto.TokenId,
                DoctorId = dto.DoctorId,
                PrescriptionDate = dto.PrescriptionDate,
                NextVisitDate = dto.NextVisitDate,
                Assessment = dto.Assessment,
                PrescriptionMedicines = dto.PrescriptionMedicines.Select(m => new PrescriptionMedicine
                {
                    MedicineId = m.MedicineId,
                    Dosage = m.Dosage,
                    Frequency = m.Frequency,
                    Duration = m.Duration
                }).ToList(),
                PrescriptionTests = dto.PrescriptionTests.Select(t => new PrescriptionTest
                {
                    TestId = t.TestId
                }).ToList(),
                PrescriptionDiagnoses = dto.PrescriptionDiagnoses.Select(d => new PrescriptionDiagnosis
                {
                    DiagnosisTitle = d.DiagnosisTitle
                }).ToList(),
                PhysicalSymptoms = dto.PhysicalSymptoms.Select(s => new PhysicalSymptom
                {
                    SymptomDescription = s.SymptomDescription
                }).ToList(),
                PrescriptionAdvices = dto.PrescriptionAdvices.Select(a => new PrescriptionAdvice
                {
                    Advice = a.Advice
                }).ToList()
            };

            _context.Prescriptions.Add(prescription);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Prescription created successfully", Id = prescription.PrescriptionId });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePrescription(int id, [FromBody] CreatePrescriptionDTO dto)
        {
            var prescription = await _context.Prescriptions
                .Include(p => p.PrescriptionMedicines)
                .Include(p => p.PrescriptionTests)
                .Include(p => p.PrescriptionDiagnoses)
                .Include(p => p.PhysicalSymptoms)
                .Include(p => p.PrescriptionAdvices)
                .FirstOrDefaultAsync(p => p.PrescriptionId == id);

            if (prescription == null)
                return NotFound();

            // Update main fields
            prescription.PrescriptionNo = dto.PrescriptionNo;
            prescription.TokenId = dto.TokenId;
            prescription.DoctorId = dto.DoctorId;
            prescription.PrescriptionDate = dto.PrescriptionDate;
            prescription.NextVisitDate = dto.NextVisitDate;
            prescription.Assessment = dto.Assessment;

            // Clear old child collections
            _context.PrescriptionMedicines.RemoveRange(prescription.PrescriptionMedicines);
            _context.PrescriptionTests.RemoveRange(prescription.PrescriptionTests);
            _context.PrescriptionDiagnoses.RemoveRange(prescription.PrescriptionDiagnoses);
            _context.PhysicalSymptoms.RemoveRange(prescription.PhysicalSymptoms);
            _context.PrescriptionAdvices.RemoveRange(prescription.PrescriptionAdvices);

            // Re-add new child collections
            prescription.PrescriptionMedicines = dto.PrescriptionMedicines.Select(m => new PrescriptionMedicine
            {
                MedicineId = m.MedicineId,
                Dosage = m.Dosage,
                Frequency = m.Frequency,
                Duration = m.Duration
            }).ToList();

            prescription.PrescriptionTests = dto.PrescriptionTests.Select(t => new PrescriptionTest
            {
                TestId = t.TestId
            }).ToList();

            prescription.PrescriptionDiagnoses = dto.PrescriptionDiagnoses.Select(d => new PrescriptionDiagnosis
            {
                DiagnosisTitle = d.DiagnosisTitle
            }).ToList();

            prescription.PhysicalSymptoms = dto.PhysicalSymptoms.Select(s => new PhysicalSymptom
            {
                SymptomDescription = s.SymptomDescription
            }).ToList();

            prescription.PrescriptionAdvices = dto.PrescriptionAdvices.Select(a => new PrescriptionAdvice
            {
                Advice = a.Advice
            }).ToList();

            await _context.SaveChangesAsync();
            return Ok(new { Message = "Prescription updated successfully" });
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeletePrescription(int id)
        {
            var prescription = await _context.Prescriptions
                .Include(p => p.PrescriptionMedicines)
                .Include(p => p.PrescriptionTests)
                .Include(p => p.PrescriptionDiagnoses)
                .Include(p => p.PhysicalSymptoms)
                .Include(p => p.PrescriptionAdvices)
                .FirstOrDefaultAsync(p => p.PrescriptionId == id);

            if (prescription == null)
                return NotFound();

            _context.PrescriptionMedicines.RemoveRange(prescription.PrescriptionMedicines);
            _context.PrescriptionTests.RemoveRange(prescription.PrescriptionTests);
            _context.PrescriptionDiagnoses.RemoveRange(prescription.PrescriptionDiagnoses);
            _context.PhysicalSymptoms.RemoveRange(prescription.PhysicalSymptoms);
            _context.PrescriptionAdvices.RemoveRange(prescription.PrescriptionAdvices);
            _context.Prescriptions.Remove(prescription);

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}



