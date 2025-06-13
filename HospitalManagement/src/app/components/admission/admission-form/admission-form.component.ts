import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // <-- Import Router
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { AdmissionService } from '../../../services/admission.service';

@Component({
  selector: 'app-admission-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './admission-form.component.html',
  styleUrls: ['./admission-form.component.css'],
})
export class AdmissionFormComponent implements OnInit {
  admissionForm!: FormGroup;
  isEditMode = false;
  patients: any[] = [];
  doctors: any[] = [];
  beds: any[] = [];

  constructor(
    private admissionService: AdmissionService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router // <-- Inject Router service
  ) {}

  ngOnInit(): void {
    this.loadDropdowns();
    this.initializeForm();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.getAdmissionById(Number(id));
    }
  }

  initializeForm(): void {
    this.admissionForm = this.fb.group({
      admissionId: [null],
      patientId: ['', Validators.required],
      doctorId: ['', Validators.required],
      bedId: ['', Validators.required],
      admissionDate: ['', Validators.required],
      dischargeDate: [''],
      nurseName: '',
      referredBy: '',
      floor: '',
      chargePerDay: [0, Validators.required],
      admissionFee: [0, Validators.required],
    });
  }

  loadDropdowns(): void {
    this.admissionService
      .getPatientsDropdown()
      .subscribe((data) => (this.patients = data));
    this.admissionService
      .getDoctorsDropdown()
      .subscribe((data) => (this.doctors = data));
    this.admissionService
      .getBedsDropdown()
      .subscribe((data) => (this.beds = data));
  }

  getAdmissionById(id: number): void {
    this.admissionService.getAdmission(id).subscribe({
      next: (response) => {
        this.admissionForm.patchValue({
          admissionId: response.admissionId,
          patientId: response.patientId,
          doctorId: response.doctorId,
          bedId: response.bedId,
          admissionDate: response.admissionDate,
          dischargeDate: response.dischargeDate,
          nurseName: response.nurseName,
          referredBy: response.referredBy,
          floor: response.floor,
          chargePerDay: response.chargePerDay,
          admissionFee: response.admissionFee,
        });
      },
      error: (err) => {
        console.error('Error fetching admission:', err);
      },
    });
  }

  createAdmission(): void {
    this.admissionService.addAdmission(this.admissionForm.value).subscribe({
      next: (response) => {
        console.log('Admission added successfully:', response);
        this.router.navigate(['/admissions']); // <-- Navigate to admission list page
      },
      error: (err) => {
        console.error('Error adding admission:', err);
      },
    });
  }

  updateAdmission(id: number): void {
    this.admissionService
      .updateAdmission(id, this.admissionForm.value)
      .subscribe({
        next: () => {
          console.log('Admission updated successfully.');
          this.router.navigate(['/admissions']); // <-- Navigate to admission list page
        },
        error: (err) => {
          console.error('Error updating admission:', err);
        },
      });
  }

  submitForm(): void {
    if (this.admissionForm.invalid) {
      console.log('Form is invalid');
      return;
    }
    if (this.isEditMode) {
      const admissionId = this.admissionForm.value.admissionId;
      this.updateAdmission(admissionId);
    } else {
      this.createAdmission();
    }
  }
}
