import { Medicine } from "./medicine";

export interface MedicineSale {
  medicineSaleId: number; // Updated
  medicineId: number; // Updated
  saleDate: Date;
  salePrice: number;
  quantitySold: number;
  discount: number;
  totalPrice: number;
  customerName: string;
  medicine?: Medicine; // Optional
}