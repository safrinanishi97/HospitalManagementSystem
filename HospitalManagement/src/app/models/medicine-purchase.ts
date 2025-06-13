import { Medicine } from "./medicine";

export interface MedicinePurchase {
  medicinePurchaseId: number; // Updated
  medicineId: number; // Updated
  purchaseDate: Date;
  purchasePrice: number;
  quantityPurchased: number;
  vat: number;
  totalPrice: number;
  supplier: string;
  medicine?: Medicine; // Optional
}