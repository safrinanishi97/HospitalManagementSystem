export interface MedicineDTO {
  medicineId: number; // Updated
  medicineType: string;
  medicineName: string;
  genericName: string;
  company: string;
}

export interface CreateMedicineDTO {
  medicineType: string;
  medicineName: string;
  genericName: string;
  company: string;
}

export interface UpdateMedicineDTO {
  medicineId: number; // Updated
  medicineType: string;
  medicineName: string;
  genericName: string;
  company: string;
}