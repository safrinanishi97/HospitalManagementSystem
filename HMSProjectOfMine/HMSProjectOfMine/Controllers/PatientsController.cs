using HMSProjectOfMine.Data;
using HMSProjectOfMine.DTOs;
using HMSProjectOfMine.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NuGet.Protocol;

namespace HMSProjectOfMine.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PatientsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Patients
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PatientReadDto>>> GetPatients()
        {
            return await _context.Patients
                .Select(p => new PatientReadDto
                {
                    PatientId = p.PatientId,
                    PatientNo = p.PatientNo,
                    FirstName = p.FirstName,
                    LastName = p.LastName,
                    RegistrationId = p.RegistrationId,
                    Gender = p.Gender,
                    Age = p.Age,
                    FirstVisitDate = p.FirstVisitDate,
                    PatientType = p.PatientType,
                    VisitType = p.VisitType
                })
                .ToListAsync();
        }

        [HttpGet("DoctorsDropdown")]
        public async Task<ActionResult<IEnumerable<Doctor>>> GetDoctors()
        {
            var doctors = await _context.Doctors
                .Select(d => new { d.DoctorId, d.FirstName, d.LastName,d.Specialization.SpecializationName,d.Department.DepartmentName })
                .ToListAsync();
            return Ok(doctors);
        }

        [HttpGet("ChambersDropdown")]
        public async Task<ActionResult<IEnumerable<Chamber>>> GetChambers()
        {
            var chambers = await _context.Chambers
                .Select(c => new { c.ChamberId, c.ChamberNo, c.Location })
                .ToListAsync();
            return Ok(chambers);
        }


        // GET: api/Patients/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PatientWithTokenDto>> GetPatient(int id)
        {
            var patient = await _context.Patients
                .Where(p => p.PatientId == id)
                .Select(p => new PatientWithTokenDto
                {
                    PatientId = p.PatientId,
                    PatientNo = p.PatientNo,
                    FirstName = p.FirstName,
                    LastName = p.LastName,
                    RegistrationId = p.RegistrationId,
                    Gender = p.Gender,
                    Age = p.Age,
                    FirstVisitDate = p.FirstVisitDate,
                    PatientType = p.PatientType,
                    VisitType = p.VisitType,
                    Token = p.Tokens.OrderByDescending(t => t.IssueTime).FirstOrDefault() == null ? null : new TokenReadDto
                    {
                        TokenId = p.Tokens.OrderByDescending(t => t.IssueTime).First().TokenId,
                        TokenNumber = p.Tokens.OrderByDescending(t => t.IssueTime).First().TokenNumber,
                        TokenFee = p.Tokens.OrderByDescending(t => t.IssueTime).First().TokenFee,
                        IssueTime = p.Tokens.OrderByDescending(t => t.IssueTime).First().IssueTime,
                        PatientId = p.Tokens.OrderByDescending(t => t.IssueTime).First().PatientId,
                        DoctorId = p.Tokens.OrderByDescending(t => t.IssueTime).First().DoctorId,
                        ChamberId = p.Tokens.OrderByDescending(t => t.IssueTime).First().ChamberId
                    }
                })
                .FirstOrDefaultAsync();

            if (patient == null)
            {
                return NotFound();
            }

            return patient;
        }

        // POST: api/Patients
        [HttpPost]
        public async Task<ActionResult<PatientWithTokenDto>> PostPatient(PatientCreateDto patientCreateDto)
        {
            var patient = new Patient
            {
                PatientNo = patientCreateDto.PatientNo,
                FirstName = patientCreateDto.FirstName,
                LastName = patientCreateDto.LastName,
                RegistrationId = patientCreateDto.RegistrationId,
                Gender = patientCreateDto.Gender,
                Age = patientCreateDto.Age,
                PatientType = patientCreateDto.PatientType,
                VisitType = patientCreateDto.VisitType,
                FirstVisitDate = DateTime.Now // Automatically set the first visit date
            };

            _context.Patients.Add(patient);
            await _context.SaveChangesAsync();

            // Generate Token
            var tokenNumber = GenerateUniqueTokenNumber(); // Implement your token number generation logic
            var token = new Token
            {
                TokenNumber = tokenNumber,
                TokenFee = patientCreateDto.TokenFee,
                PatientId = patient.PatientId,
                DoctorId = patientCreateDto.DoctorId,
                ChamberId = patientCreateDto.ChamberId,
                IssueTime = DateTime.Now
            };

            _context.Tokens.Add(token);
            await _context.SaveChangesAsync();

            // Return the created patient with the generated token
            return CreatedAtAction(nameof(GetPatient), new { id = patient.PatientId }, new PatientWithTokenDto
            {
                PatientId = patient.PatientId,
                PatientNo = patient.PatientNo,
                FirstName = patient.FirstName,
                LastName = patient.LastName,
                RegistrationId = patient.RegistrationId,
                Gender = patient.Gender,
                Age = patient.Age,
                FirstVisitDate = patient.FirstVisitDate,
                PatientType = patient.PatientType,
                VisitType = patient.VisitType,
                Token = new TokenReadDto
                {
                    TokenId = token.TokenId,
                    TokenNumber = token.TokenNumber,
                    TokenFee = token.TokenFee,
                    IssueTime = token.IssueTime,
                    PatientId = token.PatientId,
                    DoctorId = token.DoctorId,
                    ChamberId = token.ChamberId
                }
            });
        }

        // PUT: api/Patients/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPatient(int id, PatientUpdateDto patientUpdateDto)
        {
            if (id != patientUpdateDto.PatientId)
            {
                return BadRequest();
            }

            var patient = await _context.Patients.FindAsync(id);
            if (patient == null)
            {
                return NotFound();
            }

            // Update patient properties if they have values in the DTO
            if (patientUpdateDto.PatientNo != null)
            {
                patient.PatientNo = patientUpdateDto.PatientNo;
            }
            if (patientUpdateDto.FirstName != null)
            {
                patient.FirstName = patientUpdateDto.FirstName;
            }
            if (patientUpdateDto.LastName != null)
            {
                patient.LastName = patientUpdateDto.LastName;
            }
            if (patientUpdateDto.RegistrationId.HasValue)
            {
                patient.RegistrationId = patientUpdateDto.RegistrationId;
            }
            if (patientUpdateDto.Gender.HasValue)
            {
                patient.Gender = patientUpdateDto.Gender.Value;
            }
            if (patientUpdateDto.Age.HasValue)
            {
                patient.Age = patientUpdateDto.Age.Value;
            }
            if (patientUpdateDto.PatientType.HasValue)
            {
                patient.PatientType = patientUpdateDto.PatientType.Value;
            }
            if (patientUpdateDto.VisitType != null)
            {
                patient.VisitType = patientUpdateDto.VisitType;
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PatientExists(id))
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

        // DELETE: api/Patients/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePatient(int id)
        {
            var patient = await _context.Patients.FindAsync(id);
            if (patient == null)
            {
                return NotFound();
            }

            _context.Patients.Remove(patient);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PatientExists(int id)
        {
            return _context.Patients.Any(e => e.PatientId == id);
        }

        private  string GenerateUniqueTokenNumber()
        {

            var today = DateTime.Today;
            int countToday = _context.Tokens.Count(t => t.IssueTime.Date == today);

            string generatedTokenNumber = $"TKN-{(countToday + 1).ToString("D3")}";

            return generatedTokenNumber;
        }
    }

}
