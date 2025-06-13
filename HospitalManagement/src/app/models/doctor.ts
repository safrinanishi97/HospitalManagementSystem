export interface Doctor {
  doctorId: number;
  firstName: string;
  lastName: string;
  departmentId: number;
  specializationId?: number;
  phone?: string;
  email?: string;
  imageUrl?: string;
  imageFile?: File;
  departmentName: string;
  specializationName: string;
  doctorChambers?: DoctorChamber[];
  doctorSchedules?: DoctorSchedule[];
  doctorFees?: DoctorFee[];
}

export interface DoctorChamber {
  doctorChamberId?: number; // optional for creation
  doctorId?: number; // optional, will be assigned by backend
  chamberId: number;
  availableTime: string;
}

export interface DoctorSchedule {
  doctorScheduleId: number;
  doctorId: number;
  chamberId: number;
  daysOfWeek: string; // e.g., "Monday"
  startTime: string; // "HH:mm:ss"
  endTime: string; // "HH:mm:ss"
}

export interface DoctorFee {
  doctorFeeId: number;
  doctorId: number;
  fees: number;
  discountAmount?: number | null;
  effectiveDate?: string | null; // ISO date string (e.g. '2025-05-07')
  chargedFee?: number | null;
  visitType: VisitType;
}

export enum VisitType {
  FirstVisit = 0,
  FollowUp = 1,
  TestReview = 2,
  Others = 3,
}
