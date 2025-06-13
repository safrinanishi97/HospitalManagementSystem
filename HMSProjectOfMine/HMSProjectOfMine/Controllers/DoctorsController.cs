using HMSProjectOfMine.Data;
using HMSProjectOfMine.DTOs;
using HMSProjectOfMine.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace HMSProjectOfMine.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DoctorsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public DoctorsController(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // GET: api/Doctors
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DoctorDTO>>> GetDoctors()
        {
            var doctors = await _context.Doctors
                .Select(d => new DoctorDTO
                {
                    DoctorId = d.DoctorId,
                    FirstName = d.FirstName,
                    LastName = d.LastName,
                    DepartmentName = d.Department.DepartmentName,
                    SpecializationName = d.Specialization.SpecializationName,
                    Phone = d.Phone,
                    Email = d.Email,
                    ImageUrl = d.ImageUrl,

                })
                .ToListAsync();

            return Ok(doctors);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<DoctorDTO>> GetDoctor(int id)
        {
            var doctor = await _context.Doctors
                .Include(d => d.Department)
                .Include(d => d.Specialization)
                .Include(d => d.DoctorChambers)
                .Include(d => d.DoctorSchedules)
                .Include(d => d.DoctorFees)
                .FirstOrDefaultAsync(d => d.DoctorId == id);

            if (doctor == null) return NotFound();

            var dto = new DoctorDTO
            {
                DoctorId = doctor.DoctorId,
                FirstName = doctor.FirstName,
                LastName = doctor.LastName,
                Phone = doctor.Phone,
                Email = doctor.Email,
                ImageUrl = doctor.ImageUrl,
                DepartmentId = doctor.DepartmentId,
                DepartmentName = doctor.Department?.DepartmentName, // use null-safe operator
                SpecializationId = doctor.SpecializationId,
                SpecializationName = doctor.Specialization?.SpecializationName,// use null-safe operator
                ChamberId = doctor.DoctorChambers.Select(c => c.ChamberId).ToList(),
                DoctorChambers = doctor.DoctorChambers.Select(c => new DoctorChamberDTO
                {
                    ChamberId = c.ChamberId,
                    AvailableTime = c.AvailableTime,
                }).ToList(),

                DoctorScheduleId = doctor.DoctorSchedules.Select(c => c.DoctorScheduleId).ToList(),

                DoctorSchedules = doctor.DoctorSchedules.Select(c => new DoctorScheduleDTO
                {
                    DaysOfWeek = c.DaysOfWeek,
                    StartTime = c.StartTime,
                    EndTime = c.EndTime,
                }
                ).ToList(),

                DoctorFeeId = doctor.DoctorFees.Select(c => c.DoctorFeeId).ToList(),

                DoctorFees = doctor.DoctorFees.Select(c => new DoctorFeeDTO
                {
                    Fees = c.Fees,
                    DiscountAmount = c.DiscountAmount,
                    EffectiveDate = c.EffectiveDate,
                    VisitType = c.VisitType,

                }).ToList(),

            };

            return Ok(dto);
        }




        //POST: api/Doctors
        [HttpPost]
        public async Task<ActionResult> CreateDoctor([FromForm] DoctorDTO dto)
        {
            //for doctor chamber:

            if (Request.Form.TryGetValue("doctorChambers", out var chambersJson))
            {
                dto.DoctorChambers = JsonSerializer.Deserialize<List<DoctorChamberDTO>>(chambersJson!, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                }) ?? new List<DoctorChamberDTO>();
            }
            //for doctor Shedule:
            if (Request.Form.TryGetValue("doctorSchedules", out var schedulesJson))
            {
                dto.DoctorSchedules = JsonSerializer.Deserialize<List<DoctorScheduleDTO>>(schedulesJson!, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                }) ?? new List<DoctorScheduleDTO>();
            }
            //for Doctor fees:
            if (Request.Form.TryGetValue("doctorFees", out var feesJson))
            {
                dto.DoctorFees = JsonSerializer.Deserialize<List<DoctorFeeDTO>>(feesJson!, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                }) ?? new List<DoctorFeeDTO>();
            }

            // create Department
            var department = await _context.Departments
                .FirstOrDefaultAsync(d => d.DepartmentName == dto.DepartmentName);

            if (department == null)
            {
                department = new Department { DepartmentName = dto.DepartmentName };
                _context.Departments.Add(department);
                await _context.SaveChangesAsync();
            }

            //  create Specialization (if provided)
            Specialization? specialization = null;
            if (!string.IsNullOrWhiteSpace(dto.SpecializationName))
            {
                specialization = await _context.Specializations
                    .FirstOrDefaultAsync(s => s.SpecializationName == dto.SpecializationName);

                if (specialization == null)
                {
                    specialization = new Specialization { SpecializationName = dto.SpecializationName };
                    _context.Specializations.Add(specialization);
                    await _context.SaveChangesAsync();
                }
            }


            // Create Doctor
            var doctor = new Doctor
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                DepartmentId = department.DepartmentId,
                SpecializationId = specialization?.SpecializationId,
                Phone = dto.Phone,
                Email = dto.Email
            };
            _context.Doctors.Add(doctor);
            await _context.SaveChangesAsync();
            //save doctor chamber:
            foreach (var chamberDto in dto.DoctorChambers)
            {
                var doctorChamber = new DoctorChamber
                {
                    DoctorId = doctor.DoctorId,
                    ChamberId = chamberDto.ChamberId,
                    AvailableTime = chamberDto.AvailableTime
                };

                _context.DoctorChambers.Add(doctorChamber);
            }

            // Save Doctor Schedules
            foreach (var scheduleDto in dto.DoctorSchedules)
            {
                var doctorSchedule = new DoctorSchedule
                {
                    DoctorId = doctor.DoctorId,
                    ChamberId = scheduleDto.ChamberId,
                    DaysOfWeek = scheduleDto.DaysOfWeek,
                    StartTime = scheduleDto.StartTime,
                    EndTime = scheduleDto.EndTime
                };
                _context.DoctorSchedules.Add(doctorSchedule);
            }

            //Save the Doctor Fees:
            foreach (var feeDto in dto.DoctorFees)
            {
                var doctorFee = new DoctorFee
                {
                    DoctorId = doctor.DoctorId,
                    Fees = feeDto.Fees,
                    DiscountAmount = feeDto.DiscountAmount,
                    EffectiveDate = feeDto.EffectiveDate,
                    VisitType = feeDto.VisitType
                };

                _context.DoctorFees.Add(doctorFee);
            }


            // Save image if provided
            if (dto.ImageFile != null)
            {
                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(dto.ImageFile.FileName)}";
                var filePath = Path.Combine(_env.WebRootPath, "images/doctors", fileName);
                Directory.CreateDirectory(Path.GetDirectoryName(filePath)!);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await dto.ImageFile.CopyToAsync(stream);
                }

                doctor.ImageUrl = $"/images/doctors/{fileName}";
            }



            await _context.SaveChangesAsync();
            return Ok();
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDoctor(int id, [FromForm] DoctorDTO dto)
        {
            var doctor = await _context.Doctors
                .Include(d => d.DoctorChambers)
                .Include(d => d.DoctorSchedules)
                .Include(d => d.DoctorFees)
                .FirstOrDefaultAsync(d => d.DoctorId == id);

            if (doctor == null) return NotFound();

            // Deserialize nested objects
            if (Request.Form.TryGetValue("doctorChambers", out var chambersJson))
            {
                dto.DoctorChambers = JsonSerializer.Deserialize<List<DoctorChamberDTO>>(chambersJson!, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                }) ?? new List<DoctorChamberDTO>();
            }

            if (Request.Form.TryGetValue("doctorSchedules", out var schedulesJson))
            {
                dto.DoctorSchedules = JsonSerializer.Deserialize<List<DoctorScheduleDTO>>(schedulesJson!, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                }) ?? new List<DoctorScheduleDTO>();
            }

            if (Request.Form.TryGetValue("doctorFees", out var feesJson))
            {
                dto.DoctorFees = JsonSerializer.Deserialize<List<DoctorFeeDTO>>(feesJson!, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                }) ?? new List<DoctorFeeDTO>();
            }

            // Department check or create
            var department = await _context.Departments
                .FirstOrDefaultAsync(d => d.DepartmentName == dto.DepartmentName);

            if (department == null)
            {
                department = new Department { DepartmentName = dto.DepartmentName };
                _context.Departments.Add(department);
                await _context.SaveChangesAsync();
            }

            // Specialization check or create
            Specialization? specialization = null;
            if (!string.IsNullOrWhiteSpace(dto.SpecializationName))
            {
                specialization = await _context.Specializations
                    .FirstOrDefaultAsync(s => s.SpecializationName == dto.SpecializationName);

                if (specialization == null)
                {
                    specialization = new Specialization { SpecializationName = dto.SpecializationName };
                    _context.Specializations.Add(specialization);
                    await _context.SaveChangesAsync();
                }
            }

            // Update doctor basic info
            doctor.FirstName = dto.FirstName;
            doctor.LastName = dto.LastName;
            doctor.DepartmentId = department.DepartmentId;
            doctor.SpecializationId = specialization?.SpecializationId;
            doctor.Phone = dto.Phone;
            doctor.Email = dto.Email;

            // Update image if provided
            if (dto.ImageFile != null)
            {
                if (!string.IsNullOrEmpty(doctor.ImageUrl))
                {
                    var oldPath = Path.Combine(_env.WebRootPath, doctor.ImageUrl.TrimStart('/'));
                    if (System.IO.File.Exists(oldPath))
                        System.IO.File.Delete(oldPath);
                }

                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(dto.ImageFile.FileName)}";
                var filePath = Path.Combine(_env.WebRootPath, "images/doctors", fileName);
                Directory.CreateDirectory(Path.GetDirectoryName(filePath)!);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await dto.ImageFile.CopyToAsync(stream);
                }

                doctor.ImageUrl = $"/images/doctors/{fileName}";
            }

            // Clear and re-add DoctorChambers
            _context.DoctorChambers.RemoveRange(doctor.DoctorChambers);
            foreach (var chamberDto in dto.DoctorChambers)
            {
                _context.DoctorChambers.Add(new DoctorChamber
                {
                    DoctorId = doctor.DoctorId,
                    ChamberId = chamberDto.ChamberId,
                    AvailableTime = chamberDto.AvailableTime
                });
            }

            // Clear and re-add DoctorSchedules
            _context.DoctorSchedules.RemoveRange(doctor.DoctorSchedules);
            foreach (var scheduleDto in dto.DoctorSchedules)
            {
                _context.DoctorSchedules.Add(new DoctorSchedule
                {
                    DoctorId = doctor.DoctorId,
                    ChamberId = scheduleDto.ChamberId,
                    DaysOfWeek = scheduleDto.DaysOfWeek,
                    StartTime = scheduleDto.StartTime,
                    EndTime = scheduleDto.EndTime
                });
            }

            // Clear and re-add DoctorFees
            _context.DoctorFees.RemoveRange(doctor.DoctorFees);
            foreach (var feeDto in dto.DoctorFees)
            {
                _context.DoctorFees.Add(new DoctorFee
                {
                    DoctorId = doctor.DoctorId,
                    Fees = feeDto.Fees,
                    DiscountAmount = feeDto.DiscountAmount,
                    EffectiveDate = feeDto.EffectiveDate,
                    VisitType = feeDto.VisitType
                });
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/Doctors/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDoctor(int id)
        {
            var doctor = await _context.Doctors.FindAsync(id);
            if (doctor == null) return NotFound();

            // Delete image file
            if (!string.IsNullOrEmpty(doctor.ImageUrl))
            {
                var imagePath = Path.Combine(_env.WebRootPath, doctor.ImageUrl.TrimStart('/'));
                if (System.IO.File.Exists(imagePath))
                    System.IO.File.Delete(imagePath);
            }

            _context.Doctors.Remove(doctor);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

}
