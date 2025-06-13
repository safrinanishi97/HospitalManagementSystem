import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PatientService } from '../../../services/patient.service';
import { PatientRead } from '../../../models/PatientDTO';

@Component({
  selector: 'app-patient-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './patient-list.component.html',
  styleUrl: './patient-list.component.css',
})
export class PatientListComponent implements OnInit {
  patients: PatientRead[] = [];

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.patientService.getPatients().subscribe(
      (data) => {
        this.patients = data;
      },
      (error) => {
        console.error('Error loading patients:', error);
      }
    );
  }

  deletePatient(id: number): void {
    if (confirm('Are you sure you want to delete this patient?')) {
      this.patientService.deletePatient(id).subscribe(
        () => {
          this.loadPatients(); // Reload the patient list after deletion
        },
        (error) => {
          console.error('Error deleting patient:', error);
        }
      );
    }
  }
}
