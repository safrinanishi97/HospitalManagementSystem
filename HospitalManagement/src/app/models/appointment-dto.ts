export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other',
}

export enum AppointmentStatus {
  Scheduled = 'Scheduled',
  Arrived = 'Arrived',
  // InConsultation = 'InConsultation',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
  NoShow = 'NoShow',
}

export enum AppointmentType {
  General = 'General',
  FollowUp = 'FollowUp',
  Emergency = 'Emergency',
  PostOperative = 'PostOperative',
  Preventive = 'Preventive',
  Referral = 'Referral',
}
export enum VisitType {
  FirstVisit = 'FirstVisit',
  FollowUp = 'FollowUp',
  TestReview = 'TestReview',
  Others = 'Others',
}
export interface Appointment {
  appointmentId: number;
  patientId: number;
  //newly add
  firstName: string;
  lastName: string;
  visitType: VisitType;
  gender: Gender;
  //for Doctor
  docFirstName?: string;
  docLastName?: string;
  doctorDepartment?: string;

  doctorId: number;
  admissionId?: number;
  tokenId?: number;
  appointmentDate: Date;
  patientPhone?: string;
  referralCode?: string;
  appointmentStatus: AppointmentStatus;
  appointmentType: AppointmentType;
}

export interface AppointmentDTO {
  appointmentId?: number;
  patientNo: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: Gender;
  patientId?: number;
  doctorId: number;
  admissionId?: number | null;
  tokenId?: number | null;
  appointmentDate: Date | string; // Can handle both Date object and ISO string
  patientPhone?: string | null;
  referralCode?: string | null;
  appointmentStatus: AppointmentStatus;
  appointmentType: AppointmentType;
  visitType: VisitType;
}
