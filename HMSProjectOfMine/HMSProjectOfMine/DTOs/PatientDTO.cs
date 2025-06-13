using HMSProjectOfMine.Enums;
using HMSProjectOfMine.Models;

namespace HMSProjectOfMine.DTOs
{
    public class PatientCreateDto
    {
        public string PatientNo { get; set; } = null!;
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public int? RegistrationId { get; set; }
        public Gender Gender { get; set; }
        public int Age { get; set; }
        public PatientType PatientType { get; set; }
        public VisitType? VisitType { get; set; }

        // Token information to be generated upon patient creation
        public decimal TokenFee { get; set; }
        public int DoctorId { get; set; }
        public int ChamberId { get; set; }
    }

    public class PatientReadDto
    {
        public int PatientId { get; set; }
        public string PatientNo { get; set; } = null!;
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public int? RegistrationId { get; set; }
        public Gender Gender { get; set; }
        public int Age { get; set; }
        public DateTime FirstVisitDate { get; set; }
        public PatientType PatientType { get; set; }
        public VisitType? VisitType { get; set; }
        public virtual Token Tokens { get; set; }

    }

    public class PatientUpdateDto
    {
        public int PatientId { get; set; }
        public string? PatientNo { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public int? RegistrationId { get; set; }
        public Gender? Gender { get; set; }
        public int? Age { get; set; }
        public PatientType? PatientType { get; set; }
        public VisitType? VisitType { get; set; }
    }

    public class TokenReadDto
    {
        public int TokenId { get; set; }
        public string TokenNumber { get; set; } = null!;
        public decimal TokenFee { get; set; }
        public DateTime IssueTime { get; set; }
        public int PatientId { get; set; }
        public int DoctorId { get; set; }
        public int ChamberId { get; set; }
    }

    public class PatientWithTokenDto : PatientReadDto
    {
        public TokenReadDto? Token { get; set; }
    }

    
}
