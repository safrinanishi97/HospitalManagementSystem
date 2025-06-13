export interface PatientCreate {
  patientNo: string;
  firstName: string;
  lastName: string;
  registrationId?: number;
  gender: Gender; // Or an enum if you prefer in Angular
  age: number;
  patientType: PatientType; // Or an enum
  visitType?: VisitType;
  tokenFee: number;
  doctorId: number;
  chamberId: number;
}

export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other',
}

export enum VisitType {
  FirstVisit = 'FirstVisit',
  FollowUp = 'FollowUp',
  TestReview = 'TestReview',
  Others = 'Others',
}

export enum PatientType {
  Indoor = 'Indoor',
  Outdoor = 'Outdoor',
}

export interface PatientRead {
  patientId: number;
  patientNo: string;
  firstName: string;
  lastName: string;
  registrationId?: number;
  gender: string;
  age: number;
  firstVisitDate: Date;
  patientType: string;
  visitType?: string;
}

export interface PatientUpdate {
  patientId: number;
  patientNo?: string;
  firstName?: string;
  lastName?: string;
  registrationId?: number;
  gender?: Gender;
  age?: number;
  patientType?: PatientType;
  visitType?: VisitType;
}

export interface TokenRead {
  tokenId: number;
  tokenNumber: string;
  tokenFee: number;
  issueTime: Date;
  patientId: number;
  doctorId: number;
  chamberId: number;
}

export interface PatientWithToken extends PatientRead {
  token?: TokenRead;
}

export interface DoctorDropdown {
  doctorId: number;
  firstName: string;
  lastName: string;
  specializationName: string;
  departmentName: string;
}

export interface ChamberDropdown {
  chamberId: number;
  chamberNo: string;
  location: string;
}
