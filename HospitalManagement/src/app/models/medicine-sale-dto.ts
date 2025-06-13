import { MedicineDTO } from "./medicine-dto";

export interface MedicineSaleDTO {
  medicineSaleId: number; // Updated
  medicineId: number; // Updated
  saleDate: Date;
  salePrice: number;
  quantitySold: number;
  discount: number;
  totalPrice: number;
  customerName: string;
  medicine?: MedicineDTO;
}

export interface CreateMedicineSaleDTO {
  medicineId: number; // Updated
  saleDate: Date;
  salePrice: number;
  quantitySold: number;
  discount: number;
  totalPrice: number;
  customerName: string;
}

export interface UpdateMedicineSaleDTO {
  medicineSaleId: number; // Updated
  medicineId: number; // Updated
  saleDate: Date;
  salePrice: number;
  quantitySold: number;
  discount: number;
  totalPrice: number;
  customerName: string;
}