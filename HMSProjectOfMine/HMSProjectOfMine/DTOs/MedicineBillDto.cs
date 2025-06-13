using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HMSProjectOfMine.DTOs
{

    // DTOs for MedicineBill
    public class MedicineBillDTO
    {
        public int MedicineBillId { get; set; }
        public string? MedicineName { get; set; }
        public decimal Price { get; set; }
    }

    public class CreateMedicineBillDTO
    {
        [Required]
        public string? MedicineName { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }
    }

    public class UpdateMedicineBillDTO
    {
        [Required]
        public int MedicineBillId { get; set; }
        public string? MedicineName { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }
    }


    // DTOs for MedicineBilling
    public class MedicineBillingDTO
    {
        public int MedicineBillingId { get; set; }
        public string BillNo { get; set; }
        public int PatientId { get; set; }
        public string? RefBy { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal DiscountAmount { get; set; }
        public decimal DiscountPercentage { get; set; }
        public decimal PayableAmount { get; set; }
        public decimal DueAmount { get; set; }
        public decimal PaidAmount { get; set; }
        public DateOnly DeliveryDate { get; set; }
        public TimeOnly DeliveryTime { get; set; }
        public DateTime CreatedAt { get; set; }
        public virtual PatientReadDto? Patient { get; set; }
        public virtual ICollection<MedicineBillingDetailDTO> MedicineBillingDetails { get; set; } = new List<MedicineBillingDetailDTO>();
    }
    public class MedicineBillingListDTO
    {
        public int MedicineBillingId { get; set; }
        public string BillNo { get; set; }
        public int PatientId { get; set; }
        public string? RefBy { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal PayableAmount { get; set; }
        public decimal DueAmount { get; set; }
        public DateOnly DeliveryDate { get; set; }
        public TimeOnly DeliveryTime { get; set; }
        public string PatientName { get; set; }
    }

    public class CreateMedicineBillingDTO
    {
        public string BillNo { get; set; } = null!;

        public int PatientId { get; set; }

        public string? RefBy { get; set; }

        public decimal TotalAmount { get; set; }

        public decimal DiscountAmount { get; set; } = 0;

        public decimal DiscountPercentage { get; set; } = 0;

        public DateOnly DeliveryDate { get; set; }

        public TimeOnly DeliveryTime { get; set; }

        public decimal PaidAmount { get; set; } = 0;

        public virtual ICollection<CreateMedicineBillingDetailDTO> MedicineBillingDetails { get; set; } = new List<CreateMedicineBillingDetailDTO>();
    }

    public class UpdateMedicineBillingDTO
    {
        [Required]
        public int MedicineBillingId { get; set; }

        [Required]
        [StringLength(50)]
        public string BillNo { get; set; } = null!;

        [Required]
        public int PatientId { get; set; }

        [StringLength(50)]
        public string? RefBy { get; set; }

        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal TotalAmount { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal DiscountAmount { get; set; } = 0;

        [Column(TypeName = "decimal(5,2)")]
        public decimal DiscountPercentage { get; set; } = 0;

        [Required]
        public DateOnly DeliveryDate { get; set; }

        [Required]
        public TimeOnly DeliveryTime { get; set; }
        public decimal PaidAmount { get; set; } = 0;

        public virtual ICollection<UpdateMedicineBillingDetailDTO> MedicineBillingDetails { get; set; } = new List<UpdateMedicineBillingDetailDTO>();
    }

    // DTOs for MedicineBillingDetail
    public class MedicineBillingDetailDTO
    {
        public int MedicineBillingDetailId { get; set; }
        public int MedicineBillingId { get; set; }
        public int MedicineBillId { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public decimal TotalPrice { get; set; }

        public virtual MedicineBillDTO? MedicineBill { get; set; }
    }

    public class CreateMedicineBillingDetailDTO
    {
        [Required]
        public int MedicineBillId { get; set; }

        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal Price { get; set; }

        [Required]
        public int Quantity { get; set; } = 1;


    }
    public class UpdateMedicineBillingDetailDTO
    {
        [Required]
        public int MedicineBillingDetailId { get; set; }
        [Required]
        public int MedicineBillId { get; set; }

        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal Price { get; set; }

        [Required]
        public int Quantity { get; set; } = 1;


    }


}
