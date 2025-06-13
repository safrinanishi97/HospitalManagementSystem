import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { CommonModule } from '@angular/common';
import { MedicineDTO } from '../../../models/medicine-dto';
import { MedicineSaleService } from '../../../services/medicine-sale.service';
import { MedicineService } from '../../../services/medicine.service';
import { UpdateMedicineSaleDTO } from '../../../models/medicine-sale-dto';


@Component({
  selector: 'app-medicine-sale-edit',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './medicine-sale-edit.component.html',
  styleUrls: ['./medicine-sale-edit.component.css']
})
export class MedicineSaleEditComponent implements OnInit {
  saleForm: FormGroup;
  saleId: number = 0;
  medicines: MedicineDTO[] = [];
  errorMessage: string = '';
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private medicineSaleService: MedicineSaleService,
    private medicineService: MedicineService,
    private router: Router,
    private route: ActivatedRoute
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
    this.route.params.subscribe(params => {
      this.saleId = +params['id'];
      if (this.saleId) {
        this.loadMedicineSaleDetails();
      }
    });
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
        this.errorMessage = 'Error loading medicines.';
      }
    });
  }

  loadMedicineSaleDetails(): void {
    this.loading = true;
    this.medicineSaleService.getById(this.saleId).subscribe({
      next: (sale) => {
        const formattedDate = new Date(sale.saleDate).toISOString().split('T')[0];
        this.saleForm.patchValue({
          medicineId: sale.medicineId,
          saleDate: formattedDate,
          salePrice: sale.salePrice,
          quantitySold: sale.quantitySold,
          discount: sale.discount,
          totalPrice: sale.totalPrice.toFixed(2),
          customerName: sale.customerName
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading sale details:', err);
        this.errorMessage = 'Error loading medicine sale details.';
        this.loading = false;
      }
    });
  }

  getMedicineDisplay(medicine: MedicineDTO): string {
    return `${medicine.medicineName} (${medicine.genericName}) - ${medicine.company}`;
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
      this.loading = true;
      const updateSale: UpdateMedicineSaleDTO = {
        ...this.saleForm.value,
        medicineSaleId: this.saleId,
        totalPrice: parseFloat(this.saleForm.get('totalPrice')?.value)
      };
      this.medicineSaleService.update(this.saleId, updateSale).subscribe({
        next: () => {
          this.router.navigate(['/medicine-sales']);
          this.loading = false;
        },
        error: (err) => {
          console.error('Error updating sale:', err);
          this.errorMessage = 'Error updating medicine sale.';
          this.loading = false;
        }
      });
    } else {
      this.errorMessage = 'Please fill out all required fields correctly.';
    }
  }

  onCancel(): void {
    this.router.navigate(['/medicine-sales']);
  }
}