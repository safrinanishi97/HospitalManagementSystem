import { Component, OnInit } from '@angular/core';
import { PrescriptionFormComponent } from '../prescription-form/prescription-form.component';

import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PrescriptionService } from '../../../services/prescription.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-prescription-edit',
  standalone: true,
  imports: [RouterModule,PrescriptionFormComponent,CommonModule],
  template: `
    <app-prescription-form 
      [isEditMode]="true"
      [prescriptionId]="prescriptionId"
      (formSubmit)="onFormSubmit($event)">
    </app-prescription-form>
  `,
  styleUrls: ['./prescription-edit.component.css']
})
export class PrescriptionEditComponent implements OnInit {
   prescriptionId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private prescriptionService: PrescriptionService
  ) {}

  ngOnInit() {
    this.prescriptionId = this.route.snapshot.params['id'];
  }

  onFormSubmit(formData: any) {
    this.prescriptionService.updatePrescription(this.prescriptionId, formData).subscribe({
      next: () => {
        this.router.navigate(['/prescriptions', this.prescriptionId]);
      }
    });
  }
}