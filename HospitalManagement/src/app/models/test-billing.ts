export interface TestBillingDetailDTO {
  testBillingDetailId?: number;
  testId: number;
  price: number;
  quantity: number;
}

export interface TestBillingDTO {
  testBillingId?: number;
  billNo: string;
  patientId: number;
  refBy?: string;
  discountAmount: number;
  discountPercentage: number;
  paidAmount: number;
  deliveryDate: Date;
  deliveryTime: string;
  testBillingDetails: TestBillingDetailDTO[];
}

export interface TestBilling extends TestBillingDTO {
  totalAmount: number;
  payableAmount: number;
  dueAmount: number;
}