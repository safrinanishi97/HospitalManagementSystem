import { Component, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MedicineSaleDTO } from '../../../models/medicine-sale-dto';
import { MedicineDTO } from '../../../models/medicine-dto';
import { MedicineSaleService } from '../../../services/medicine-sale.service';
import { MedicineService } from '../../../services/medicine.service';


@Component({
  selector: 'app-medicine-sale-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './medicine-sale-list.component.html',
  styleUrls: ['./medicine-sale-list.component.css']
})
export class MedicineSaleListComponent implements OnInit {
  medicineSales: MedicineSaleDTO[] = [];
  medicines: MedicineDTO[] = []; // Store medicine data
  isLoading: boolean = true;

  constructor(
    private medicineSaleService: MedicineSaleService,
    private medicineService: MedicineService // Inject MedicineService
  ) { }

  ngOnInit(): void {
    this.loadMedicines(); // Load medicines first
  }

  loadMedicines(): void {
    this.medicineService.getAll().subscribe({
      next: (medicines) => {
        this.medicines = medicines;
        this.loadMedicineSales(); // Then load sales
      },
      error: (error) => {
        console.error('Error loading medicines:', error);
        this.isLoading = false;
      }
    });
  }

  loadMedicineSales(): void {
    this.medicineSaleService.getAll().subscribe({
      next: (data) => {
        this.medicineSales = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading medicine sales:', error);
        this.isLoading = false;
      }
    });
  }

  getMedicineName(medicineId: number): string {
    const medicine = this.medicines.find(m => m.medicineId === medicineId);
    return medicine ? `${medicine.medicineName}` : 'Unknown';
  }

  deleteMedicineSale(id: number): void {
    if (confirm('Are you sure you want to delete this sale?')) {
      this.medicineSaleService.delete(id).subscribe({
        next: () => {
          this.loadMedicineSales();
        },
        error: (error) => {
          console.error('Error deleting medicine sale:', error);
        }
      });
    }
  }
}