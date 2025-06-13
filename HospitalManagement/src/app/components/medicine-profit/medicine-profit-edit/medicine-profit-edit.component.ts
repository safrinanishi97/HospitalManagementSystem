import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { CommonModule, formatDate } from '@angular/common'; // Import formatDate
import { MedicineProfitDTO, UpdateMedicineProfitDTO } from '../../../models/medicine-profit-dto';
import { MedicineProfitService } from '../../../services/medicine-profit.service';


@Component({
  selector: 'app-medicine-profit-edit',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './medicine-profit-edit.component.html',
  styleUrls: ['./medicine-profit-edit.component.css']
})
export class MedicineProfitEditComponent implements OnInit {
  medicineProfitId!: number;
  editForm!: FormGroup;
  medicineProfit?: MedicineProfitDTO;
  loading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private medicineProfitService: MedicineProfitService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.medicineProfitId = +params['id']; // (+) converts string 'id' to a number
      this.loadMedicineProfit();
    });

    this.editForm = this.fb.group({
      medicineSaleId: ['', Validators.required],
      profitDate: ['', Validators.required],
      profitAmount: ['', [Validators.required, Validators.min(0)]],
      quantityProfit: ['', [Validators.required, Validators.min(1)]],
      totalProfit: [{ value: '', disabled: true }, [Validators.required, Validators.min(0)]]
    });

    // Subscribe to changes
    this.editForm.get('profitAmount')?.valueChanges.subscribe(() => this.calculateTotalProfit());
    this.editForm.get('quantityProfit')?.valueChanges.subscribe(() => this.calculateTotalProfit());
  }

  loadMedicineProfit(): void {
    this.loading = true;
    this.medicineProfitService.getById(this.medicineProfitId).pipe(
      tap(
        (profit: any) => {
          this.medicineProfit = profit;
          // Format the date to 'YYYY-MM-DD'
          const formattedDate = formatDate(profit.profitDate, 'yyyy-MM-dd', 'en-US');
          this.editForm.patchValue({
            medicineSaleId: profit.medicineSaleId,
            profitDate: formattedDate, // Use the formatted date
            profitAmount: profit.profitAmount,
            quantityProfit: profit.quantityProfit,
            totalProfit: profit.totalProfit
          });
          this.loading = false;
          this.calculateTotalProfit(); // Initial calculation
        },
        (error) => {
          this.errorMessage = 'Error loading medicine profit.';
          this.loading = false;
          console.error(error);
        }
      )
    ).subscribe();
  }

  calculateTotalProfit(): void {
    const profitAmount = this.editForm.get('profitAmount')?.value;
    const quantityProfit = this.editForm.get('quantityProfit')?.value;
    if (profitAmount !== null && quantityProfit !== null) {
      this.editForm.patchValue({ totalProfit: profitAmount * quantityProfit });
    } else {
      this.editForm.patchValue({ totalProfit: '' });
    }
  }

  onSubmit(): void {
    if (this.editForm.valid) {
      this.loading = true;
      
      // Create the update DTO with all required fields
      const updatedProfit: UpdateMedicineProfitDTO = {
        medicineProfitId: this.medicineProfitId, // Include the ID
        medicineSaleId: this.editForm.value.medicineSaleId,
        profitDate: this.editForm.value.profitDate,
        profitAmount: this.editForm.value.profitAmount,
        quantityProfit: this.editForm.value.quantityProfit,
        totalProfit: this.editForm.value.profitAmount * this.editForm.value.quantityProfit
        // Calculate totalProfit here instead of relying on the disabled field
      };
  
      this.medicineProfitService.update(this.medicineProfitId, updatedProfit).pipe(
        tap(
          () => {
            this.loading = false;
            this.router.navigate(['/medicine-profits']);
          },
          (error) => {
            this.errorMessage = 'Error updating medicine profit. Please check your data.';
            this.loading = false;
            console.error('Update error:', error);
          }
        )
      ).subscribe();
    }
  }

  onCancel(): void {
    this.router.navigate(['/medicine-profits']);
  }
 }