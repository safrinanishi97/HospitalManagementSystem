// 1. PrescriptionDTO Interface
export interface PrescriptionDTO {
  prescriptionId: number;
  prescriptionNo: string;
  tokenId: number;
  tokenNumber: string;
  doctorId: number;
  firstName: string;
  lastName: string;
  prescriptionDate: Date;
  nextVisitDate?: Date;
  assessment?: string;
  prescriptionMedicines: PrescriptionMedicineDTO[];
  prescriptionTests: PrescriptionTestDTO[];
  prescriptionDiagnoses: PrescriptionDiagnosisDTO[];
  physicalSymptoms: PhysicalSymptomDTO[];
  prescriptionAdvices: PrescriptionAdviceDTO[];
}

// 2. PrescriptionMedicineDTO Interface
export interface PrescriptionMedicineDTO {
  prescriptionMedicineId: number;
  medicineId: number;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
}

// 3. PrescriptionTestDTO Interface
export interface PrescriptionTestDTO {
  prescriptionTestId: number;
  testId: number;
  testName: string;
}

// 4. PrescriptionDiagnosisDTO Interface
export interface PrescriptionDiagnosisDTO {
  prescriptionDiagnosisId: number;
  diagnosisTitle: string;
}

// 5. PhysicalSymptomDTO Interface
export interface PhysicalSymptomDTO {
  physicalSymptomId: number;
  symptomDescription: string;
}

// 6. PrescriptionAdviceDTO Interface
export interface PrescriptionAdviceDTO {
  prescriptionAdviceId: number;
  advice: string;
}

// 7. CreatePrescriptionDTO Interface
export interface CreatePrescriptionDTO {
  prescriptionNo: string;
  tokenId: number;
  doctorId: number;
  prescriptionDate: Date;
  nextVisitDate?: Date;
  assessment?: string;
  prescriptionMedicines: CreatePrescriptionMedicineDTO[];
  prescriptionTests: CreatePrescriptionTestDTO[];
  prescriptionDiagnoses: CreatePrescriptionDiagnosisDTO[];
  physicalSymptoms: CreatePhysicalSymptomDTO[];
  prescriptionAdvices: CreatePrescriptionAdviceDTO[];
}

// 8. CreatePrescriptionMedicineDTO Interface
export interface CreatePrescriptionMedicineDTO {
  medicineId: number;
  dosage: string;
  frequency: string;
  duration: string;
}

// 9. CreatePrescriptionTestDTO Interface
export interface CreatePrescriptionTestDTO {
  testId: number;
}

// 10. CreatePrescriptionDiagnosisDTO Interface
export interface CreatePrescriptionDiagnosisDTO {
  diagnosisTitle: string;
}

// 11. CreatePhysicalSymptomDTO Interface
export interface CreatePhysicalSymptomDTO {
  symptomDescription: string;
}

// 12. CreatePrescriptionAdviceDTO Interface
export interface CreatePrescriptionAdviceDTO {
  advice: string;
}

// 13. PrescriptionListDTO Interface (for listing view)
export interface PrescriptionListDTO {
  prescriptionId: number;
  prescriptionNo: string;
  prescriptionDate: Date;
  // patientName: string;
  nextVisitDate: Date;
  firstName: string;
  lastName: string;
}

export interface DoctorLookupDTO {
  value: number; // Changed from doctorId
  label: string; // Changed from fullName
}

export interface TokenLookupDTO {
  value: number; // Changed from tokenId
  label: string; // Changed from tokenNumber
}

export interface TestLookupDTO {
  value: number; // Changed from testId
  label: string; // Changed from testName
}

export interface MedicineLookupDTO {
  value: number; // Changed from medicineId
  label: string; // Changed from medicineName
}

// 18. PrescriptionFormDataDTO Interface
export interface PrescriptionFormDataDTO {
  doctors: DoctorLookupDTO[];
  tokens: TokenLookupDTO[];
  tests: TestLookupDTO[];
  medicines: MedicineLookupDTO[];
}

// 19. PrescriptionSummaryDTO Interface
export interface PrescriptionSummaryDTO {
  prescriptionId: number;
  prescriptionNo: string;
  prescriptionDate: Date;
  doctorName: string;
  // patientName: string;
  medicineCount: number;
  testCount: number;
}
