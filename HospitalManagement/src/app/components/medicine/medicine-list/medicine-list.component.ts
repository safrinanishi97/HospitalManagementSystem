import { Component, OnInit } from '@angular/core';

import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MedicineDTO } from '../../../models/medicine-dto';
import { MedicineService } from '../../../services/medicine.service';

@Component({
  selector: 'app-medicine-list',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './medicine-list.component.html',
  styleUrl: './medicine-list.component.css'
})
export class MedicineListComponent implements OnInit {
  medicines: MedicineDTO[] = [];
  errorMessage: string = '';

  constructor(private medicineService: MedicineService, private router: Router) { }

  ngOnInit(): void {
    this.loadMedicines();
  }

  loadMedicines(): void {
    this.medicineService.getAll().subscribe(
      (data) => {
        this.medicines = data;
      },
      (error) => {
        this.errorMessage = 'Error loading medicines: ' + error;
        console.error(this.errorMessage);
      }
    );
  }

  deleteMedicine(id: number): void {
    if (confirm('Are you sure you want to delete this medicine?')) {
      this.medicineService.delete(id).subscribe(
        () => {
          console.log('Medicine deleted successfully');
          this.loadMedicines(); // Reload the list after deletion
        },
        (error) => {
          this.errorMessage = 'Error deleting medicine: ' + error;
          console.error(this.errorMessage);
        }
      );
    }
  }
}
