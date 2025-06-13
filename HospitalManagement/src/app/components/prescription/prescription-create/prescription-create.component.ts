import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PrescriptionService } from '../../../services/prescription.service';
import { PrescriptionFormComponent } from '../prescription-form/prescription-form.component';

@Component({
  selector: 'app-prescription-create',
  standalone: true,
  imports: [PrescriptionFormComponent, CommonModule],
  templateUrl: './prescription-create.component.html',
  styleUrls: ['./prescription-create.component.css']
})
export class PrescriptionCreateComponent {
  @ViewChild(PrescriptionFormComponent) formComponent!: PrescriptionFormComponent;

  constructor(
    private prescriptionService: PrescriptionService,
    private router: Router
  ) {}

  onSaveClick() {
    if (this.formComponent.form.invalid) {
      this.formComponent.form.markAllAsTouched();
      return;
    }

    const formData = this.formComponent.form.value;

    this.prescriptionService.createPrescription(formData).subscribe({
      next: (result) => {
        this.router.navigate(['/prescriptions', result.id]);
      }
    });
  }

  onCancelClick() {
    this.router.navigate(['/prescriptions']);
  }
}
