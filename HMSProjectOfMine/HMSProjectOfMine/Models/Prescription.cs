using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace HMSProjectOfMine.Models
{

    [Table("Prescriptions")]
    public class Prescription
    {
        [Key]
        public int PrescriptionId { get; set; }
        public string PrescriptionNo { get; set; } = null!;

        public DateTime PrescriptionDate { get; set; } = DateTime.Now;

        public DateTime? NextVisitDate { get; set; }


        public string? Assessment { get; set; }

        public int TokenId { get; set; }

        public int DoctorId { get; set; }
        public virtual Doctor Doctor { get; set; } = null!;
        public virtual Token Token { get; set; } = null!;


        public virtual ICollection<PrescriptionMedicine> PrescriptionMedicines { get; set; } = new List<PrescriptionMedicine>();

        public virtual ICollection<PrescriptionTest> PrescriptionTests { get; set; } = new List<PrescriptionTest>();

        public virtual ICollection<PrescriptionDiagnosis> PrescriptionDiagnoses { get; set; } = new List<PrescriptionDiagnosis>();
        public virtual ICollection<PhysicalSymptom> PhysicalSymptoms { get; set; } = new List<PhysicalSymptom>();

        public virtual ICollection<PrescriptionAdvice> PrescriptionAdvices { get; set; } = new List<PrescriptionAdvice>();
    }


    public class PrescriptionMedicine
    {

        public int PrescriptionMedicineId { get; set; }


        public int PrescriptionId { get; set; }

        public int MedicineId { get; set; }



        public string Dosage { get; set; }

        public string Frequency { get; set; }


        public string Duration { get; set; }

        public virtual Prescription Prescription { get; set; } = null!;

        public virtual Medicine Medicine { get; set; } = null!;
    }

    public class PrescriptionTest
    {
        [Key]
        public int PrescriptionTestId { get; set; }


        public int PrescriptionId { get; set; }


        public int TestId { get; set; }

        public virtual Prescription Prescription { get; set; } = null!;


        public virtual Test Test { get; set; } = null!;


        public virtual ICollection<TestReport> TestReports { get; set; } = new List<TestReport>();
    }

    public class PrescriptionDiagnosis
    {

        public int PrescriptionDiagnosisId { get; set; }


        public int PrescriptionId { get; set; }


        public string DiagnosisTitle { get; set; } = null!;


        public virtual Prescription Prescription { get; set; } = null!;
    }


    public class PrescriptionAdvice
    {

        public int PrescriptionAdviceId { get; set; }


        public int PrescriptionId { get; set; }


        public string Advice { get; set; } = null!;

        public virtual Prescription Prescription { get; set; } = null!;
    }

    public class PhysicalSymptom
    {

        public int PhysicalSymptomId { get; set; }

        public int PrescriptionId { get; set; }

        public string SymptomDescription { get; set; } = null!;

        public virtual Prescription Prescription { get; set; } = null!;
    }


}
