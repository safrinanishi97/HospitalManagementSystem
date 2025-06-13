import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common'; // Import DatePipe
import { PatientWithToken } from '../../../models/PatientDTO';
import { PatientService } from '../../../services/patient.service';

@Component({
  selector: 'app-patient-detail',
  standalone: true, // Mark as standalone
  imports: [CommonModule, DatePipe, RouterLink], // Import DatePipe to make it available
  templateUrl: './patient-detail.component.html',
  styleUrls: ['./patient-detail.component.css'],
  providers: [DatePipe],
})
export class PatientDetailComponent implements OnInit {
  patient: PatientWithToken | null = null;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService,
    private datePipe: DatePipe // Inject DatePipe
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const patientId = +params['id'];
      this.getPatientDetails(patientId);
    });
  }

  getPatientDetails(id: number): void {
    this.patientService.getPatient(id).subscribe(
      (patient) => {
        this.patient = patient;
        console.log('Patient Details:', this.patient);
      },
      (error) => {
        this.errorMessage = 'Error fetching patient details.';
        console.error(this.errorMessage, error);
      }
    );
  }

  formatDate(date: Date | null): string {
    if (date) {
      return this.datePipe.transform(date, 'medium') || '';
    }
    return '';
  }

  printToken() {
    window.print();
  }
}
