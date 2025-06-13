export interface TokenDto {
    // tokenId: number;
    tokenNumber: string;
    tokenFee: number;
    patientId: number | null;
    doctorId: number;
    chamberId: number;
    issueTime: string | null;  // We use string for the date-time, you can parse it to a Date object in Angular
    prescriptions?: Prescription[];  // Optional array, assuming you have an interface for Prescription
  }

  export interface Prescription {
    prescriptionId: number;
    description: string;
    dateIssued: string;
  }


  export interface Doctor {
    doctorId: number;
    firstName: string;
    lastName: string;
  }

  
  export interface Chamber {
    chamberId: number;
    chamberNo: string;
    location: string;
  }

  
  export interface Patient {
    patientId: number;
    firstName: string;
    lastName: string;
  }
  