import { MedicinePurchase } from "./medicine-purchase";

export interface MedicineLoss {
  medicineLossId: number; // Updated
  medicinePurchaseId: number; // Updated
  lossDate: Date;
  quantityLoss: number;
  lossAmount: number;
  totalLoss: number;
  lossReason: string;
  medicinePurchase?: MedicinePurchase;
}