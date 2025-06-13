export interface MedicineBillingList {
  medicineBillingId: number;
  billNo: string;
  patientId: number;
  refBy: string;
  totalAmount: number;
  payableAmount: number;
  dueAmount: number;
  deliveryDate?: Date | null;
  deliveryTime?: string | null;
  patientName: string;
}

export interface Patient {
  patientId: number;
  firstName: string;
}

export interface MedicineBill {
  medicineBillId: number;
  medicineName: string;
  price: number;
  // Add other medicine bill properties as needed
}

export interface MedicineBillingDetail {
  medicineBillingDetailId: number;
  medicineBillingId: number;
  medicineBillId: number;
  price: number;
  quantity: number;
  totalPrice: number;
  medicineBill?: MedicineBill;
}

export interface MedicineBilling {
  medicineBillingId: number;
  billNo: string;
  patientId: number;
  refBy: string;
  totalAmount: number;
  discountAmount?: number | null;
  discountPercentage?: number | null;
  payableAmount: number;
  dueAmount: number;
  paidAmount?: number | null;
  deliveryDate?: Date | null;
  deliveryTime?: string | null;
  createdAt?: Date | null;
  patient?: Patient;
  medicineBillingDetails?: MedicineBillingDetail[];
}

export interface CreateMedicineBilling {
  billNo: string;
  patientId: number;
  refBy?: string | null;
  totalAmount: number;
  discountAmount?: number | null;
  discountPercentage?: number | null;
  deliveryDate?: Date | null;
  deliveryTime?: string | null;
  paidAmount?: number | null;
  medicineBillingDetails: CreateMedicineBillingDetail[];
}

export interface CreateMedicineBillingDetail {
  medicineBillId: number;
  price: number;
  quantity: number;
}

export interface UpdateMedicineBilling extends CreateMedicineBilling {
  medicineBillingId: number;
  medicineBillingDetails: UpdateMedicineBillingDetail[];
}

export interface UpdateMedicineBillingDetail
  extends CreateMedicineBillingDetail {
  medicineBillingDetailId?: number;
}
