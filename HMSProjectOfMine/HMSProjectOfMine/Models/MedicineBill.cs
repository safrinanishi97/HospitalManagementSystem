using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace HMSProjectOfMine.Models
{
    public class MedicineBill
    {
        [Key]
        public int MedicineBillId { get; set; }

        public string? MedicineName { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        [InverseProperty(nameof(MedicineBillingDetail.MedicineBill))]
        public virtual ICollection<MedicineBillingDetail> MedicineBillingDetails { get; set; } = new List<MedicineBillingDetail>();
    }
    public class MedicineBilling
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int MedicineBillingId { get; set; }

        [Required]
        [StringLength(50)]
        public string BillNo { get; set; } = null!;

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

        public decimal PayableAmount { get; set; }
        public decimal DueAmount { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal PaidAmount { get; set; } = 0;

        public DateOnly DeliveryDate { get; set; }

        public TimeOnly DeliveryTime { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime? CreatedAt { get; set; }

        // Navigation properties
        [ForeignKey(nameof(PatientId))]
        public virtual Patient Patient { get; set; } = null!;

        [InverseProperty(nameof(MedicineBillingDetail.MedicineBilling))]
        public virtual ICollection<MedicineBillingDetail> MedicineBillingDetails { get; set; } = new List<MedicineBillingDetail>();
    }
    public class MedicineBillingDetail
    {
        [Key]
        public int MedicineBillingDetailId { get; set; }

        public int MedicineBillingId { get; set; }
        public int MedicineBillId { get; set; }

        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal Price { get; set; }

        public int Quantity { get; set; } = 1;

        public decimal TotalPrice { get; set; }

        // Navigation properties
        [ForeignKey(nameof(MedicineBillingId))]
        public virtual MedicineBilling MedicineBilling { get; set; } = null!;

        [ForeignKey(nameof(MedicineBillId))]
        public virtual MedicineBill MedicineBill { get; set; } = null!;
    }

}
