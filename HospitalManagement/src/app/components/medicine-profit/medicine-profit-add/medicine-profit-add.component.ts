import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MedicineProfitService } from '../../../services/medicine-profit.service';
import { CreateMedicineProfitDTO } from '../../../models/medicine-profit-dto';

@Component({
  selector: 'app-medicine-profit-add',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './medicine-profit-add.component.html',
  styleUrl: './medicine-profit-add.component.css'
})
export class MedicineProfitAddComponent implements OnInit {
  addForm: FormGroup;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private medicineProfitService: MedicineProfitService,
    private router: Router
  ) {
    this.addForm = this.fb.group({
      medicineSaleId: ['', Validators.required],
      profitDate: ['', Validators.required],
      profitAmount: ['', [Validators.required, Validators.min(0)]],
      quantityProfit: ['', [Validators.required, Validators.min(1)]],
      totalProfit: [{ value: 0, disabled: true }]
    });

    // Subscribe to changes in profitAmount and quantityProfit
    this.addForm.get('profitAmount')?.valueChanges.subscribe(() => this.calculateTotalProfit());
    this.addForm.get('quantityProfit')?.valueChanges.subscribe(() => this.calculateTotalProfit());
  }

  ngOnInit(): void {}

  calculateTotalProfit(): void {
    const profitAmount = parseFloat(this.addForm.get('profitAmount')?.value) || 0;
    const quantityProfit = parseInt(this.addForm.get('quantityProfit')?.value) || 0;
    const total = profitAmount * quantityProfit;
    this.addForm.patchValue({ totalProfit: total.toFixed(2) });
  }

  onSubmit(): void {
    if (this.addForm.valid) {
      this.loading = true;
      const formValue = this.addForm.getRawValue();
      const newProfit: CreateMedicineProfitDTO = {
        medicineSaleId: formValue.medicineSaleId,
        profitDate: formValue.profitDate,
        profitAmount: formValue.profitAmount,
        quantityProfit: formValue.quantityProfit,
        totalProfit: parseFloat(formValue.totalProfit) // Convert string to number
      };

      this.medicineProfitService.create(newProfit).subscribe({
        next: () => {
          this.router.navigate(['/medicine-profits']);
        },
        error: (error) => {
          this.error = 'Error adding medicine profit.';
          console.error('Error adding medicine profit:', error);
          this.loading = false;
        }
      });
    } else {
      this.error = 'Please fill out all required fields correctly.';
    }
  }
}