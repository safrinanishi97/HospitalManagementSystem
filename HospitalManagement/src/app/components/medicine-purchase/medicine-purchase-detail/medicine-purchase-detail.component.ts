import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, RouterLink } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { CommonModule, Location, CurrencyPipe, DatePipe } from '@angular/common';
import { MedicinePurchase } from '../../../models/medicine-purchase';
import { Medicine } from '../../../models/medicine';
import { MedicinePurchaseService } from '../../../services/medicine-purchase.service';
import { MedicineService } from '../../../services/medicine.service';


@Component({
  selector: 'app-medicine-purchase-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, DatePipe],
  templateUrl: './medicine-purchase-detail.component.html',
})
export class MedicinePurchaseDetailComponent implements OnInit {
  medicinePurchase: MedicinePurchase | undefined;
  medicine: Medicine | undefined; // Property to hold the specific medicine details
  loading = true;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private medicinePurchaseService: MedicinePurchaseService,
    private medicineService: MedicineService,
    private location: Location
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadMedicinePurchase(id);
    } else {
      this.errorMessage = 'Invalid medicine purchase ID';
      this.loading = false;
    }
  }

  loadMedicinePurchase(id: number): void {
    this.loading = true;
    this.medicinePurchaseService.getById(id).subscribe({
      next: (data) => {
        this.medicinePurchase = data;
        this.loadMedicineDetails(data.medicineId); // Load medicine details after purchase
      },
      error: (error) => {
        this.errorMessage = 'Failed to load purchase details';
        console.error('Error:', error);
        this.loading = false;
      }
    });
  }

  loadMedicineDetails(medicineId: number): void {
    this.medicineService.getById(medicineId).subscribe({
      next: (medicine) => {
        this.medicine = medicine;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load medicine details';
        console.error('Error loading medicine:', error);
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.location.back();
  }
}