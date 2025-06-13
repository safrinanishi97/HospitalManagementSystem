namespace HMSProjectOfMine.DTOs
{
    public class MedicineBillingDetailDto
    {
        public int? MedicineBillingDetailId { get; set; } // For update support
        public int MedicineBillId { get; set; }

        public decimal Price { get; set; }
        public int Quantity { get; set; } = 1;
    }
}
