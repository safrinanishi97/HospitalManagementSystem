import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { Router, RouterLink } from '@angular/router';

import { CommonModule } from '@angular/common';
import { MedicineLossService } from '../../../services/medicine-loss.service';
import { CreateMedicineLossDTO } from '../../../models/medicine-loss-dto';

@Component({
  selector: 'app-medicine-loss-add',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './medicine-loss-add.component.html',
  styleUrl: './medicine-loss-add.component.css'
})
export class MedicineLossAddComponent implements OnInit {
  addForm: FormGroup;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private medicineLossService: MedicineLossService,
    private router: Router
  ) {
    this.addForm = this.fb.group({
      medicinePurchaseId: ['', Validators.required],
      lossDate: ['', Validators.required],
      quantityLoss: ['', [Validators.required, Validators.min(1)]],
      lossAmount: ['', [Validators.required, Validators.min(0)]],
      totalLoss: [{value: '', disabled: true}, [Validators.required, Validators.min(0)]],
      lossReason: ['', Validators.required]
    });

    // Calculate total when quantity or amount changes
    this.addForm.get('quantityLoss')?.valueChanges.subscribe(() => this.calculateTotal());
    this.addForm.get('lossAmount')?.valueChanges.subscribe(() => this.calculateTotal());
  }

  ngOnInit(): void {
  }

  calculateTotal(): void {
    const quantity = this.addForm.get('quantityLoss')?.value;
    const amount = this.addForm.get('lossAmount')?.value;
    
    if (quantity && amount) {
      const total = quantity * amount;
      this.addForm.get('totalLoss')?.setValue(total.toFixed(2), {emitEvent: false});
    } else {
      this.addForm.get('totalLoss')?.setValue(0, {emitEvent: false});
    }
  }

  onSubmit(): void {
    if (this.addForm.valid) {
      this.loading = true;
      const formValue = this.addForm.getRawValue(); // Use getRawValue() to include disabled fields
      const newLoss: CreateMedicineLossDTO = formValue;
      this.medicineLossService.create(newLoss).subscribe({
        next: () => {
          this.router.navigate(['/medicine-losses']); // Navigate back to the list on success
        },
        error: (error) => {
          this.error = 'Error adding medicine loss.';
          console.error('Error adding medicine loss:', error);
          this.loading = false;
        }
      });
    } else {
      this.error = 'Please fill out all required fields correctly.';
    }
  }
}