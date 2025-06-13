import { MedicineSaleDTO } from "./medicine-sale-dto";

export interface MedicineProfitDTO {
  medicineProfitId: number; // Updated
  medicineSaleId: number; // Updated
  profitDate: Date;
  profitAmount: number;
  quantityProfit: number;
  totalProfit: number;
  medicineSale?: MedicineSaleDTO;
}

export interface CreateMedicineProfitDTO {
  medicineSaleId: number; // Updated
  profitDate: Date;
  profitAmount: number;
  quantityProfit: number;
  totalProfit: number;
}

export interface UpdateMedicineProfitDTO {
  medicineProfitId: number; // Updated
  medicineSaleId: number; // Updated
  profitDate: Date;
  profitAmount: number;
  quantityProfit: number;
  totalProfit: number;
}