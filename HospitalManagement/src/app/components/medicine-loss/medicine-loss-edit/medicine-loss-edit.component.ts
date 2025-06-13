import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MedicineLossService } from '../../../services/medicine-loss.service';
import { UpdateMedicineLossDTO } from '../../../models/medicine-loss-dto';

@Component({
  selector: 'app-medicine-loss-edit',
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './medicine-loss-edit.component.html',
  styleUrl: './medicine-loss-edit.component.css'
})
export class MedicineLossEditComponent implements OnInit {
  editForm: FormGroup;
  loading = true;
  error = '';
  medicineLossId: number | null = null;
  private quantityLossSubscription: Subscription | undefined;
  private lossAmountSubscription: Subscription | undefined;

  constructor(
    private fb: FormBuilder,
    private medicineLossService: MedicineLossService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.editForm = this.fb.group({
      medicinePurchaseId: ['', Validators.required],
      lossDate: ['', Validators.required],
      quantityLoss: ['', [Validators.required, Validators.min(1)]],
      lossAmount: ['', [Validators.required, Validators.min(0)]],
      totalLoss: [0, [Validators.required, Validators.min(0)]], // Changed from disabled to readonly
      lossReason: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.medicineLossId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.medicineLossId) {
      this.loadMedicineLoss(this.medicineLossId);
    } else {
      this.error = 'Invalid medicine loss ID.';
      this.loading = false;
    }

    // Subscribe to changes in quantityLoss
    this.quantityLossSubscription = this.editForm.controls['quantityLoss'].valueChanges.subscribe(() => {
      this.calculateTotalLoss();
    });

    // Subscribe to changes in lossAmount
    this.lossAmountSubscription = this.editForm.controls['lossAmount'].valueChanges.subscribe(() => {
      this.calculateTotalLoss();
    });
  }

  ngOnDestroy(): void {
    if (this.quantityLossSubscription) {
      this.quantityLossSubscription.unsubscribe();
    }
    if (this.lossAmountSubscription) {
      this.lossAmountSubscription.unsubscribe();
    }
  }

  loadMedicineLoss(id: number): void {
    this.loading = true;
    this.medicineLossService.getById(id).subscribe({
      next: (data) => {
        // Format the date properly
        const lossDate = new Date(data.lossDate);
        const formattedDate = lossDate.toISOString().substring(0, 10);
        
        this.editForm.patchValue({
          medicinePurchaseId: data.medicinePurchaseId,
          lossDate: formattedDate,
          quantityLoss: data.quantityLoss,
          lossAmount: data.lossAmount,
          totalLoss: data.totalLoss,
          lossReason: data.lossReason
        });
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error loading medicine loss for editing.';
        console.error('Error loading medicine loss:', error);
        this.loading = false;
      }
    });
  }

  calculateTotalLoss(): void {
    const quantityLoss = this.editForm.get('quantityLoss')?.value;
    const lossAmount = this.editForm.get('lossAmount')?.value;

    if (quantityLoss !== null && lossAmount !== null) {
      const totalLoss = quantityLoss * lossAmount;
      this.editForm.patchValue({
        totalLoss: totalLoss
      });
    }
  }

  onSubmit(): void {
    if (this.editForm.valid && this.medicineLossId) {
      this.loading = true;
      
      // Create a proper payload
      const formValue = this.editForm.value;
      const updatedLoss: UpdateMedicineLossDTO = {
        medicineLossId: this.medicineLossId,
        medicinePurchaseId: formValue.medicinePurchaseId,
        lossDate: new Date(formValue.lossDate).toISOString(), // Ensure proper date format
        quantityLoss: formValue.quantityLoss,
        lossAmount: formValue.lossAmount,
        totalLoss: formValue.totalLoss,
        lossReason: formValue.lossReason
      };

      console.log('Update Payload:', updatedLoss);
      
      this.medicineLossService.update(this.medicineLossId, updatedLoss).subscribe({
        next: () => {
          this.router.navigate(['/medicine-losses']);
        },
        error: (error) => {
          this.error = 'Error updating medicine loss. Please check your inputs.';
          console.error('Error updating medicine loss:', error);
          this.loading = false;
        }
      });
    } else {
      this.error = 'Please ensure all fields are valid.';
      this.markFormGroupTouched(this.editForm);
    }
  }

  // Helper method to mark all fields as touched to show validation errors
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
