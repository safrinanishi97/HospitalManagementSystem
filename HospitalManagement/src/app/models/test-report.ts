// models/test-report.model.ts
export interface TestReport {
  testReportId: number;
  prescriptionTestId: number;
  testResult: string;
  isFinalized: boolean;
}

export interface TestReportDTO {
  testReportId?: number;
  prescriptionTestId: number;
  testResult: string;
  isFinalized: boolean;
}