import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  Gender,
  PatientType,
  PatientUpdate,
  VisitType,
} from '../../../models/PatientDTO';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../../../services/patient.service';

@Component({
  selector: 'app-patient-edit',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './patient-edit.component.html',
  styleUrl: './patient-edit.component.css',
})
export class PatientEditComponent implements OnInit {
  patientId: number = 0;
  patient: PatientUpdate = { patientId: 0 };
  genders = Object.values(Gender);
  patientTypes = Object.values(PatientType);
  visitTypes = Object.values(VisitType);

  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.patientId = +params['id'];
      this.loadPatient();
    });
  }

  loadPatient(): void {
    this.patientService.getPatient(this.patientId).subscribe(
      (data) => {
        this.patient = {
          patientId: data.patientId,
          patientNo: data.patientNo,
          firstName: data.firstName,
          lastName: data.lastName,
          registrationId: data.registrationId,
          age: data.age,
        };
      },
      (error) => {
        console.error('Error loading patient:', error);
      }
    );
  }

  updatePatient(): void {
    if (this.patientId && this.patient) {
      this.patientService.updatePatient(this.patientId, this.patient).subscribe(
        () => {
          console.log('Patient updated successfully');
          this.router.navigate(['/']);
        },
        (error) => {
          console.error('Error updating patient:', error);
        }
      );
    }
  }
}
