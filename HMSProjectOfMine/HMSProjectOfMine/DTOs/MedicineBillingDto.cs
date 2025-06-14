﻿namespace HMSProjectOfMine.DTOs
{
    public class MedicineBillingDto
    {

        public int? MedicineBillingId { get; set; }
        public string BillNo { get; set; } = null!;
        public int PatientId { get; set; }
        public string? RefBy { get; set; }
        public decimal DiscountAmount { get; set; } = 0;
        public decimal DiscountPercentage { get; set; } = 0;
        public decimal PaidAmount { get; set; } = 0;
        public DateOnly DeliveryDate { get; set; }
        public string DeliveryTime { get; set; }

        public List<MedicineBillingDetailDto> medicineBillingDetails { get; set; } = new();
    }
}
