import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  ChamberDropdown,
  DoctorDropdown,
  Gender,
  PatientCreate,
  PatientType,
  VisitType,
} from '../../../models/PatientDTO';
import { PatientService } from '../../../services/patient.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patient-create',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './patient-create.component.html',
  styleUrl: './patient-create.component.css',
})
export class PatientCreateComponent implements OnInit {
  newPatient: PatientCreate = {
    patientNo: '',
    firstName: '',
    lastName: '',
    gender: Gender.Male, // Default value from enum
    age: 0,
    patientType: PatientType.Indoor, // Default value from enum
    visitType: VisitType.FirstVisit,
    tokenFee: 0,
    doctorId: 0,
    chamberId: 0,
  };
  doctors: DoctorDropdown[] = [];
  chambers: ChamberDropdown[] = [];
  genders: string[] = Object.values(Gender); // Use string[] here
  patientTypes: string[] = Object.values(PatientType); //and here
  visitTypes: string[] = Object.values(VisitType);

  constructor(private patientService: PatientService, private router: Router) {}

  ngOnInit(): void {
    this.loadDropdowns();
  }

  loadDropdowns(): void {
    this.patientService.getDoctorsDropdown().subscribe(
      (data) => {
        this.doctors = data;
      },
      (error) => {
        console.error('Error loading doctors:', error);
      }
    );

    this.patientService.getChambersDropdown().subscribe(
      (data) => {
        this.chambers = data;
      },
      (error) => {
        console.error('Error loading chambers:', error);
      }
    );
  }

  createPatient(): void {
    this.patientService.createPatient(this.newPatient).subscribe(
      (response) => {
        console.log('Patient created successfully with token:', response);
        // this.router.navigate(['/patients/:id']);
        this.router.navigate(['/patients', response.patientId]);
      },
      (error) => {
        console.error('Error creating patient:', error);
      }
    );
  }
}
