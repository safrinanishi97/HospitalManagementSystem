// import { Component } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import {
//   AppointmentDTO,
//   Gender,
//   AppointmentStatus,
//   AppointmentType,
// } from '../../../models/appointment-dto';
// import { AppointmentService } from '../../../services/appointment.service';
// import { Router } from '@angular/router';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-appointment-create',
//   standalone: true,
//   imports: [FormsModule, CommonModule],
//   templateUrl: './appointment-create.component.html',
//   styleUrl: './appointment-create.component.css',
// })
// export class AppointmentCreateComponent {
//   Gender = Gender;
//   AppointmentStatus = AppointmentStatus;
//   AppointmentType = AppointmentType;

//   appointment: AppointmentDTO = {
//     patientNo: '',
//     firstName: '',
//     lastName: '',
//     age: 0,
//     gender: Gender.Male,
//     doctorId: 0,
//     appointmentDate: new Date(),
//     appointmentStatus: AppointmentStatus.Scheduled,
//     appointmentType: AppointmentType.General,
//   };

//   constructor(
//     private appointmentService: AppointmentService,
//     private router: Router
//   ) {}

//   getEnumOptions(enumObj: any): { key: string; value: any }[] {
//     return Object.keys(enumObj)
//       .filter((key) => isNaN(Number(key)))
//       .map((key) => ({
//         key,
//         value: enumObj[key as keyof typeof enumObj],
//       }));
//   }

//   cancel(): void {
//     this.router.navigate(['/appointment']);
//   }

//   onSubmit(): void {
//     this.appointmentService.createAppointment(this.appointment).subscribe({
//       next: (app) => {
//         this.router.navigate(['/appointment', app.appointmentId]);
//       },
//       error: (err) => {
//         console.error('Error creating appointment', err);
//       },
//     });
//   }
// }
// import { Component } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import {
//   AppointmentDTO,
//   Gender,
//   AppointmentStatus,
//   AppointmentType,
//   VisitType,
// } from '../../../models/appointment-dto';
// import { AppointmentService } from '../../../services/appointment.service';
// import { Router } from '@angular/router';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-appointment-create',
//   standalone: true,
//   imports: [FormsModule, CommonModule],
//   templateUrl: './appointment-create.component.html',
//   styleUrl: './appointment-create.component.css',
// })
// export class AppointmentCreateComponent {
//   Gender = Gender;
//   AppointmentStatus = AppointmentStatus;
//   AppointmentType = AppointmentType;
//   VisitType = VisitType;
//   appointment: AppointmentDTO = {
//     patientNo: '',
//     firstName: '',
//     lastName: '',
//     age: 0,
//     gender: Gender.Male,
//     doctorId: 0,
//     appointmentDate: new Date(),
//     appointmentStatus: AppointmentStatus.Scheduled,
//     appointmentType: AppointmentType.General,
//     visitType: VisitType.FirstVisit,
//   };

//   constructor(
//     private appointmentService: AppointmentService,
//     private router: Router
//   ) {}

//   getEnumOptions(enumObj: any): { key: string; value: any }[] {
//     return Object.keys(enumObj)
//       .filter((key) => isNaN(Number(key)))
//       .map((key) => ({
//         key,
//         value: enumObj[key as keyof typeof enumObj],
//       }));
//   }

//   cancel(): void {
//     this.router.navigate(['/appointment']);
//   }

//   onSubmit(): void {
//     // ✅ Log the payload being sent
//     console.log('Submitting appointment:', this.appointment);

//     this.appointmentService.createAppointment(this.appointment).subscribe({
//       next: (app) => {
//         console.log('Appointment created successfully:', app);
//         this.router.navigate(['/appointment', app.appointmentId]);
//       },
//       error: (err) => {
//         console.error('Error creating appointment', err);

//         // ✅ Log validation errors from backend (if any)
//         if (err.error?.errors) {
//           console.error('Validation errors:', err.error.errors);
//         }
//       },
//     });
//   }
// }

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AppointmentDTO,
  Gender,
  AppointmentStatus,
  AppointmentType,
  VisitType,
} from '../../../models/appointment-dto';
import { AppointmentService } from '../../../services/appointment.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-appointment-create',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './appointment-create.component.html',
  styleUrl: './appointment-create.component.css',
})
export class AppointmentCreateComponent {
  // Enums exposed to template
  Gender = Gender;
  AppointmentStatus = AppointmentStatus;
  AppointmentType = AppointmentType;
  VisitType = VisitType;

  // Appointment model
  appointment: AppointmentDTO = {
    patientNo: '',
    firstName: '',
    lastName: '',
    age: 0,
    gender: Gender.Male,
    doctorId: 0,
    referralCode: '',
    appointmentDate: new Date(),
    appointmentStatus: AppointmentStatus.Scheduled,
    appointmentType: AppointmentType.General,
    visitType: VisitType.FirstVisit, // ✅ Set default value
  };

  constructor(
    private appointmentService: AppointmentService,
    private router: Router
  ) {}

  // Utility to convert enum to dropdown options
  getEnumOptions(enumObj: any): { key: string; value: number }[] {
    return Object.keys(enumObj)
      .filter((key) => isNaN(Number(key)))
      .map((key) => ({
        key,
        value: enumObj[key],
      }));
  }

  // Cancel button action
  cancel(): void {
    this.router.navigate(['/appointment']);
  }

  // Form submission
  onSubmit(): void {
    console.log('Submitting appointment:', this.appointment);
    this.appointmentService.createAppointment(this.appointment).subscribe({
      next: (app) => {
        console.log('Appointment created successfully:', app);
        this.router.navigate(['/appointment', app.appointmentId]);
      },
      error: (err) => {
        console.error('Error creating appointment', err);
        if (err.error?.errors) {
          console.error('Validation errors:', err.error.errors);
        }
      },
    });
  }
}
