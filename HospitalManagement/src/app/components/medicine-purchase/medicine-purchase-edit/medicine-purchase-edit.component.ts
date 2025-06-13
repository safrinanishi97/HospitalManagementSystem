import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MedicineDTO } from '../../../models/medicine-dto';
import { MedicinePurchaseService } from '../../../services/medicine-purchase.service';
import { MedicineService } from '../../../services/medicine.service';
import { UpdateMedicinePurchaseDTO } from '../../../models/medicine-purchase-dto';


@Component({
  selector: 'app-medicine-purchase-edit',
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './medicine-purchase-edit.component.html',
  styleUrl: './medicine-purchase-edit.component.css'
})
export class MedicinePurchaseEditComponent implements OnInit {
  purchaseForm: FormGroup;
  purchaseId: number = 0;
  medicines: MedicineDTO[] = [];

  constructor(
      private fb: FormBuilder,
      private medicinePurchaseService: MedicinePurchaseService,
      private medicineService: MedicineService,
      private router: Router,
      private route: ActivatedRoute
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
      
      this.route.params.subscribe(params => {
          this.purchaseId = +params['id'];
          if (this.purchaseId) {
              this.loadMedicinePurchaseDetails();
          }
      });
  }

  loadMedicines(): void {
      this.medicineService.getAll().subscribe({
          next: (medicines) => {
              this.medicines = medicines;
          },
          error: (err) => {
              console.error('Error loading medicines:', err);
          }
      });
  }

  getMedicineDisplay(medicine: MedicineDTO): string {
      return `${medicine.medicineName} (${medicine.genericName}) - ${medicine.company}`;
  }

  loadMedicinePurchaseDetails(): void {
      this.medicinePurchaseService.getById(this.purchaseId).subscribe({
          next: (purchase) => {
              const formattedDate = new Date(purchase.purchaseDate).toISOString().split('T')[0];
              this.purchaseForm.patchValue({ ...purchase, purchaseDate: formattedDate });
          },
          error: (err) => {
              console.error('Error loading purchase details:', err);
          }
      });
  }

  calculateTotalPrice(): void {
      const price = this.purchaseForm.get('purchasePrice')?.value || 0;
      const quantity = this.purchaseForm.get('quantityPurchased')?.value || 0;
      const vatRate = this.purchaseForm.get('vat')?.value || 0;
      const totalPrice = (price * quantity) * (1 + (vatRate / 100));
      this.purchaseForm.get('totalPrice')?.setValue(totalPrice.toFixed(2));
  }

  onSubmit(): void {
      if (this.purchaseForm.valid) {
          const updatePurchase: UpdateMedicinePurchaseDTO = { 
              ...this.purchaseForm.value, 
              medicinePurchaseId: this.purchaseId 
          };
          this.medicinePurchaseService.update(this.purchaseId, updatePurchase).subscribe({
              next: () => {
                  this.router.navigate(['/medicine-purchases']);
              },
              error: (err) => {
                  console.error('Error updating purchase:', err);
              }
          });
      }
  }

  onCancel(): void {
      this.router.navigate(['/medicine-purchases']);
  }
}