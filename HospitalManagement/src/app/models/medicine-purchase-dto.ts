import { MedicineDTO } from "./medicine-dto";

export interface MedicinePurchaseDTO {
  medicinePurchaseId: number; // Updated
  medicineId: number; // Updated
  purchaseDate: Date;
  purchasePrice: number;
  quantityPurchased: number;
  vat: number;
  totalPrice: number;
  supplier: string;
  medicine?: MedicineDTO;
}

export interface CreateMedicinePurchaseDTO {
  medicineId: number; // Updated
  purchaseDate: Date;
  purchasePrice: number;
  quantityPurchased: number;
  vat: number;
  totalPrice: number;
  supplier: string;
}

export interface UpdateMedicinePurchaseDTO {
  medicinePurchaseId: number; // Updated
  medicineId: number; // Updated
  purchaseDate: Date;
  purchasePrice: number;
  quantityPurchased: number;
  vat: number;
  totalPrice: number;
  supplier: string;
}