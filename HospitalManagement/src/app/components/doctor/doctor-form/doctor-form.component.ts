import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DoctorService } from '../../../services/doctor.service';
import { Doctor } from '../../../models/doctor';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-doctor-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './doctor-form.component.html',
  styleUrls: ['./doctor-form.component.css'],
})
export class DoctorFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  doctorId = 0;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private doctorService: DoctorService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      departmentName: ['', Validators.required],
      specializationName: ['', Validators.required],
      phone: [''],
      email: ['', Validators.email],
      imageFile: [null],
      doctorChambers: this.fb.array([]),
      doctorSchedules: this.fb.array([]),
      doctorFees: this.fb.array([]),
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.doctorId = +idParam;
      this.isEdit = true;
      this.doctorService.getById(this.doctorId).subscribe((doc) => {
        this.form.patchValue({
          firstName: doc.firstName,
          lastName: doc.lastName,
          departmentName: doc.departmentName,
          specializationName: doc.specializationName,
          phone: doc.phone,
          email: doc.email,
        });

        if (doc.doctorChambers && doc.doctorChambers.length > 0) {
          doc.doctorChambers.forEach((chamber) => {
            this.doctorChambers.push(
              this.fb.group({
                chamberId: [chamber.chamberId, Validators.required],
                availableTime: [chamber.availableTime, Validators.required],
              })
            );
          });
        } else {
          this.addChamber();
        }

        if (doc.doctorSchedules && doc.doctorSchedules.length > 0) {
          doc.doctorSchedules.forEach((schedule) => {
            this.doctorSchedules.push(
              this.fb.group({
                chamberId: [schedule.chamberId, Validators.required],
                daysOfWeek: [schedule.daysOfWeek, Validators.required],
                startTime: [schedule.startTime, Validators.required],
                endTime: [schedule.endTime, Validators.required],
              })
            );
          });
        } else {
          this.addSchedule();
        }

        if (doc.doctorFees && doc.doctorFees.length > 0) {
          doc.doctorFees.forEach((fee) => {
            this.doctorFees.push(
              this.fb.group({
                fees: [fee.fees, Validators.required],
                discountAmount: [fee.discountAmount],
                effectiveDate: [fee.effectiveDate],
                chargedFee: [fee.chargedFee],
                visitType: [fee.visitType.toString(), Validators.required],
              })
            );
          });
        } else {
          this.addFee();
        }
      });
    } else {
      this.addChamber();
      this.addSchedule();
      this.addFee();
    }
  }

  get doctorChambers(): FormArray {
    return this.form.get('doctorChambers') as FormArray;
  }

  get doctorSchedules(): FormArray {
    return this.form.get('doctorSchedules') as FormArray;
  }

  get doctorFees(): FormArray {
    return this.form.get('doctorFees') as FormArray;
  }

  createChamber(): FormGroup {
    return this.fb.group({
      chamberId: [null, Validators.required],
      availableTime: ['', Validators.required],
    });
  }

  createSchedule(): FormGroup {
    return this.fb.group({
      chamberId: [null, Validators.required],
      daysOfWeek: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
    });
  }

  createFee(): FormGroup {
    return this.fb.group({
      fees: [null, Validators.required],
      discountAmount: [null],
      effectiveDate: [null],
      chargedFee: [null],
      visitType: ['0', Validators.required], // default to InPerson
    });
  }

  addChamber(): void {
    this.doctorChambers.push(this.createChamber());
  }

  addSchedule(): void {
    this.doctorSchedules.push(this.createSchedule());
  }

  addFee(): void {
    this.doctorFees.push(this.createFee());
  }

  removeChamber(index: number): void {
    this.doctorChambers.removeAt(index);
  }

  removeSchedule(index: number): void {
    this.doctorSchedules.removeAt(index);
  }

  removeFee(index: number): void {
    this.doctorFees.removeAt(index);
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.form.get('imageFile')?.setValue(file);
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.value;

    // Format time fields
    formValue.doctorSchedules = formValue.doctorSchedules.map(
      (schedule: any) => ({
        chamberId: +schedule.chamberId,
        daysOfWeek: schedule.daysOfWeek,
        startTime:
          schedule.startTime.length === 5
            ? `${schedule.startTime}:00`
            : schedule.startTime,
        endTime:
          schedule.endTime.length === 5
            ? `${schedule.endTime}:00`
            : schedule.endTime,
      })
    );

    formValue.doctorChambers = formValue.doctorChambers.map((chamber: any) => ({
      chamberId: +chamber.chamberId,
      availableTime:
        chamber.availableTime.length === 5
          ? `${chamber.availableTime}:00`
          : chamber.availableTime,
    }));

    formValue.doctorFees = formValue.doctorFees.map((fee: any) => ({
      fees: +fee.fees,
      discountAmount: fee.discountAmount ? +fee.discountAmount : 'N/A',
      effectiveDate: fee.effectiveDate ?? null,
      chargedFee: fee.chargedFee ? +fee.chargedFee : null,
      visitType: +fee.visitType,
    }));

    const formData = new FormData();
    formData.append('firstName', formValue.firstName);
    formData.append('lastName', formValue.lastName);
    formData.append('departmentName', formValue.departmentName);
    formData.append('specializationName', formValue.specializationName);
    formData.append('phone', formValue.phone ?? '');
    formData.append('email', formValue.email ?? '');

    if (this.selectedFile) {
      formData.append('imageFile', this.selectedFile);
    }

    formData.append('doctorChambers', JSON.stringify(formValue.doctorChambers));
    formData.append(
      'doctorSchedules',
      JSON.stringify(formValue.doctorSchedules)
    );
    formData.append('doctorFees', JSON.stringify(formValue.doctorFees));

    const request = this.isEdit
      ? this.doctorService.updateWithFormData(this.doctorId, formData)
      : this.doctorService.createWithFormData(formData);

    request.subscribe(() => this.router.navigate(['/doctors']));
  }
}
