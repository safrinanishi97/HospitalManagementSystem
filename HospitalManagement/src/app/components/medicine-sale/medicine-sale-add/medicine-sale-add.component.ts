import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { Router, RouterLink } from '@angular/router';

import { CommonModule } from '@angular/common';
import { MedicineDTO } from '../../../models/medicine-dto';
import { MedicineSaleService } from '../../../services/medicine-sale.service';
import { MedicineService } from '../../../services/medicine.service';
import { CreateMedicineSaleDTO } from '../../../models/medicine-sale-dto';


@Component({
  selector: 'app-medicine-sale-add',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './medicine-sale-add.component.html',
  styleUrls: ['./medicine-sale-add.component.css']
})
export class MedicineSaleAddComponent implements OnInit {
  saleForm: FormGroup;
  medicines: MedicineDTO[] = [];
  errorMessage: string = ''; // Add errorMessage property

  constructor(
    private fb: FormBuilder,
    private medicineSaleService: MedicineSaleService,
    private medicineService: MedicineService,
    private router: Router
  ) {
    this.saleForm = this.fb.group({
      medicineId: ['', Validators.required],
      saleDate: ['', Validators.required],
      salePrice: ['', [Validators.required, Validators.min(0)]],
      quantitySold: ['', [Validators.required, Validators.min(1), Validators.pattern('^[0-9]*$')]],
      discount: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      totalPrice: ['', Validators.required],
      customerName: ['', Validators.required]
    });

    this.setupFormListeners();
  }

  ngOnInit(): void {
    this.loadMedicines();
  }

  private setupFormListeners(): void {
    this.saleForm.get('salePrice')?.valueChanges.subscribe(() => this.calculateTotalPrice());
    this.saleForm.get('quantitySold')?.valueChanges.subscribe(() => this.calculateTotalPrice());
    this.saleForm.get('discount')?.valueChanges.subscribe(() => this.calculateTotalPrice());
  }

  loadMedicines(): void {
    this.medicineService.getAll().subscribe({
      next: (medicines) => {
        this.medicines = medicines;
      },
      error: (err) => {
        console.error('Error loading medicines:', err);
        this.errorMessage = 'Error loading medicines. Please try again.'; // Set error message
      }
    });
  }

  getMedicineDisplay(medicine: MedicineDTO): string {
    return `${medicine.medicineName} (${medicine.genericName})`;
  }

  calculateTotalPrice(): void {
    const price = this.saleForm.get('salePrice')?.value || 0;
    const quantity = this.saleForm.get('quantitySold')?.value || 0;
    const discountRate = this.saleForm.get('discount')?.value || 0;
    const discountedPrice = price * (1 - (discountRate / 100));
    const totalPrice = discountedPrice * quantity;
    this.saleForm.get('totalPrice')?.setValue(totalPrice.toFixed(2));
  }

  onSubmit(): void {
    if (this.saleForm.valid) {
      const createSale: CreateMedicineSaleDTO = this.saleForm.value;
      this.medicineSaleService.create(createSale).subscribe({
        next: () => {
          this.router.navigate(['/medicine-sales']);
        },
        error: (err) => {
          console.error('Error creating sale:', err);
          this.errorMessage = 'Error creating the sale. Please check the details.'; // Set error message
        }
      });
    } else {
      this.errorMessage = 'Please fill in all required fields correctly.'; // Set error message for invalid form
    }
  }

  onCancel(): void {
    this.router.navigate(['/medicine-sales']);
  }
}