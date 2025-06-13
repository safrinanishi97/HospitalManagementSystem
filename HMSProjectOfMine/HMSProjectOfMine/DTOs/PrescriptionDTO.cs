using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HMSProjectOfMine.DTOs
{
    public class PrescriptionDTO
    {
        public int PrescriptionId { get; set; }
        public string PrescriptionNo { get; set; } = null!;
        public int TokenId { get; set; }
        public string TokenNumber { get; set; } = null!;
        public int DoctorId { get; set; }
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public DateTime PrescriptionDate { get; set; } = DateTime.Now;
        public DateTime? NextVisitDate { get; set; }
        public string? Assessment { get; set; }
        public List<PrescriptionMedicineDTO> PrescriptionMedicines { get; set; } = new();
        public List<PrescriptionTestDTO> PrescriptionTests { get; set; } = new();
        public List<PrescriptionDiagnosisDTO> PrescriptionDiagnoses { get; set; } = new();
        public List<PhysicalSymptomDTO> PhysicalSymptoms { get; set; } = new();
        public List<PrescriptionAdviceDTO> PrescriptionAdvices { get; set; } = new();
    }

    public class PrescriptionMedicineDTO
    {
        public int PrescriptionMedicineId { get; set; }

        public int MedicineId { get; set; }
        public string MedicineName { get; set; } = null!;
        public string Dosage { get; set; }
        public string Frequency { get; set; }
        public string Duration { get; set; }
    }
    public class PrescriptionTestDTO
    {
        public int PrescriptionTestId { get; set; }



        public int TestId { get; set; }

        public string TestName { get; set; } = null!;

    }

    public class PrescriptionDiagnosisDTO
    {
        public int PrescriptionDiagnosisId { get; set; }


        public string DiagnosisTitle { get; set; } = null!;
    }

    public class PhysicalSymptomDTO
    {
        public int PhysicalSymptomId { get; set; }

        public string SymptomDescription { get; set; } = null!;
    }

    public class PrescriptionAdviceDTO
    {
        public int PrescriptionAdviceId { get; set; }

        public string Advice { get; set; } = null!;
    }




    public class CreatePrescriptionDTO
    {
        public string PrescriptionNo { get; set; } = null!;
        public int TokenId { get; set; }
        public int DoctorId { get; set; }
        public DateTime PrescriptionDate { get; set; } = DateTime.Now;
        public DateTime? NextVisitDate { get; set; }
        public string? Assessment { get; set; }

        public List<CreatePrescriptionMedicineDTO> PrescriptionMedicines { get; set; } = new();
        public List<CreatePrescriptionTestDTO> PrescriptionTests { get; set; } = new();
        public List<CreatePrescriptionDiagnosisDTO> PrescriptionDiagnoses { get; set; } = new();
        public List<CreatePhysicalSymptomDTO> PhysicalSymptoms { get; set; } = new();
        public List<CreatePrescriptionAdviceDTO> PrescriptionAdvices { get; set; } = new();
    }

    public class CreatePrescriptionMedicineDTO
    {
        public int MedicineId { get; set; }
        public string Dosage { get; set; } = null!;
        public string Frequency { get; set; } = null!;
        public string Duration { get; set; } = null!;
    }

    public class CreatePrescriptionTestDTO
    {
        public int TestId { get; set; }
    }

    public class CreatePrescriptionDiagnosisDTO
    {
        public string DiagnosisTitle { get; set; } = null!;
    }

    public class CreatePhysicalSymptomDTO
    {
        public string SymptomDescription { get; set; } = null!;
    }

    public class CreatePrescriptionAdviceDTO
    {
        public string Advice { get; set; } = null!;
    }


}
