import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MedicinePurchase } from '../../../models/medicine-purchase';
import { MedicinePurchaseService } from '../../../services/medicine-purchase.service';
import { MedicineService } from '../../../services/medicine.service';


@Component({
  selector: 'app-medicine-purchase-list',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './medicine-purchase-list.component.html',
  styleUrl: './medicine-purchase-list.component.css'
})
export class MedicinePurchaseListComponent implements OnInit {
  medicinePurchases: MedicinePurchase[] = [];
  medicines: { [key: number]: string } = {}; // Object to store medicine names by ID
  errorMessage = '';

  constructor(
      private medicinePurchaseService: MedicinePurchaseService,
      private medicineService: MedicineService, // Inject MedicineService
      private router: Router
  ) { }

  ngOnInit(): void {
      this.loadMedicinePurchases();
      this.loadMedicines();
  }

  loadMedicinePurchases(): void {
      this.medicinePurchaseService.getAll().subscribe({
          next: (data) => {
              this.medicinePurchases = data;
          },
          error: (error) => {
              this.errorMessage = 'Error loading medicine purchases.';
              console.error('Error loading medicine purchases:', error);
          }
      });
  }

  loadMedicines(): void {
      this.medicineService.getAll().subscribe({
          next: (medicines) => {
              this.medicines = medicines.reduce((acc: { [key: number]: string }, medicine: any) => {
                  acc[medicine.medicineId] = `${medicine.medicineName}`;
                  return acc;
              }, {});
          },
          error: (error) => {
              console.error('Error loading medicines for dropdown:', error);
              // Optionally handle error display
          }
      });
  }

  getMedicineName(medicineId: number): string { // <--- ADD THIS FUNCTION
      return this.medicines[medicineId] || 'N/A';
  }

  deleteMedicinePurchase(id: number): void {
      if (confirm('Are you sure you want to delete this purchase?')) {
          this.medicinePurchaseService.delete(id).subscribe({
              next: () => {
                  this.loadMedicinePurchases(); // Reload the list after deletion
              },
              error: (error) => {
                  console.error('Error deleting medicine purchase:', error);
                  this.errorMessage = 'Error deleting medicine purchase.';
              }
          });
      }
  }
}
