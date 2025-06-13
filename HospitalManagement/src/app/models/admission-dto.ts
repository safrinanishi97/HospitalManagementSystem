// export class AdmissionDTO {
//   admissionId!: number;
//   patientId!: number;
//   doctorId!: number;
//   bedId!: number;
//   admissionDate!: Date;
//   dischargeDate?: Date;
//   nurseName?: string;
//   referredBy?: string;
//   floor?: string;
//   chargePerDay!: number;
//   admissionFee!: number;
// }


export class AdmissionDTO {
    admissionId!: number;
  
    patientId!: number;
    patientFirstName!: string;
    patientLastName!: string;
  
    doctorId!: number;
    doctorFirstName!: string;
    doctorLastName!: string;
  
    bedId!: number;
    bedNumber!: string;
    isOccupied!: boolean;
  
    admissionDate!: Date;
    dischargeDate?: Date;
  
    nurseName?: string;
    referredBy?: string;
    floor?: string;
  
    chargePerDay!: number;
    admissionFee!: number;
  }
  