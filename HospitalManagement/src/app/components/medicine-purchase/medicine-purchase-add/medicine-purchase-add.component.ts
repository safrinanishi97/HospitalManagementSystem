import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { Router, RouterLink } from '@angular/router';

import { CommonModule } from '@angular/common';
import { MedicinePurchaseService } from '../../../services/medicine-purchase.service';
import { MedicineService } from '../../../services/medicine.service';
import { CreateMedicinePurchaseDTO } from '../../../models/medicine-purchase-dto';


@Component({
  selector: 'app-medicine-purchase-add',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './medicine-purchase-add.component.html',
  styleUrl: './medicine-purchase-add.component.css'
})
export class MedicinePurchaseAddComponent implements OnInit {
    purchaseForm: FormGroup;
    medicinesDropdown: any[] = [];
    errorMessage: string = ''; // Declare the errorMessage property here
  
    constructor(
      private fb: FormBuilder,
      private medicinePurchaseService: MedicinePurchaseService,
      private medicineService: MedicineService,
      private router: Router
    ) {
      this.purchaseForm = this.fb.group({
        medicineId: ['', Validators.required],
        purchaseDate: ['', Validators.required],
        purchasePrice: ['', [Validators.required, Validators.min(0)]],
        quantityPurchased: ['', [Validators.required, Validators.min(1), Validators.pattern('^[0-9]*$')]],
        vat: ['', [Validators.required, Validators.min(0)]],
        totalPrice: ['', Validators.required],
        supplier: ['', Validators.required]
      });
  
      this.purchaseForm.controls['purchasePrice'].valueChanges.subscribe(() => this.calculateTotalPrice());
      this.purchaseForm.controls['quantityPurchased'].valueChanges.subscribe(() => this.calculateTotalPrice());
      this.purchaseForm.controls['vat'].valueChanges.subscribe(() => this.calculateTotalPrice());
    }
  
    ngOnInit(): void {
      this.loadMedicines();
    }
  
    loadMedicines(): void {
      this.medicineService.getAll().subscribe(
        (medicines) => {
          this.medicinesDropdown = medicines;
        },
        (error) => {
          console.error('Error loading medicines:', error);
          this.errorMessage = 'Error loading medicines. Please try again later.'; // Assign an error message
        }
      );
    }
  
    calculateTotalPrice(): void {
      const price = this.purchaseForm.get('purchasePrice')?.value || 0;
      const quantity = this.purchaseForm.get('quantityPurchased')?.value || 0;
      const vatRate = this.purchaseForm.get('vat')?.value || 0;
      const totalPrice = (price * quantity) * (1 + (vatRate / 100));
      this.purchaseForm.controls['totalPrice'].setValue(totalPrice.toFixed(2));
    }
  
    onSubmit(): void {
      if (this.purchaseForm.valid) {
        const createPurchase: CreateMedicinePurchaseDTO = this.purchaseForm.value;
        this.medicinePurchaseService.create(createPurchase).subscribe({
          next: () => {
            this.router.navigate(['/medicine-purchases']);
          },
          error: (error) => {
            console.error('Error creating medicine purchase:', error);
            this.errorMessage = 'Error creating medicine purchase. Please check the details.'; // Assign an error message
          }
        });
      } else {
        this.errorMessage = 'Please fill in all required fields correctly.'; // Assign an error message for invalid form
      }
    }
  
    onCancel(): void {
      this.router.navigate(['/medicine-purchases']);
    }
  }