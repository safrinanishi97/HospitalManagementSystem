import { MedicineSale } from "./medicine-sale";

export interface MedicineProfit {
  medicineProfitId: number; // Updated
  medicineSaleId: number; // Updated
  profitDate: Date;
  profitAmount: number;
  quantityProfit: number;
  totalProfit: number;
  medicineSale?: MedicineSale; // Optional
}