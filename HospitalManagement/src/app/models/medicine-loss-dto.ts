import { MedicinePurchaseDTO } from "./medicine-purchase-dto";

export interface MedicineLossDTO {
  medicineLossId: number; // Updated
  medicinePurchaseId: number; // Updated
  lossDate: Date;
  quantityLoss: number;
  lossAmount: number;
  totalLoss: number;
  lossReason: string;
  medicinePurchase?: MedicinePurchaseDTO;
}

export interface CreateMedicineLossDTO {
  medicinePurchaseId: number; // Updated
  lossDate: Date;
  quantityLoss: number;
  lossAmount: number;
  totalLoss: number;
  lossReason: string;
}

export interface UpdateMedicineLossDTO {
  medicineLossId: number;
  medicinePurchaseId: number;
  lossDate: Date | string; // Allow both Date and string
  quantityLoss: number;
  lossAmount: number;
  totalLoss: number;
  lossReason: string;
}