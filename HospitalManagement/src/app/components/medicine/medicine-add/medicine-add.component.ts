import { Component } from '@angular/core';

import { Router, RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CreateMedicineDTO } from '../../../models/medicine-dto';
import { MedicineService } from '../../../services/medicine.service';

@Component({
  selector: 'app-medicine-add',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './medicine-add.component.html',
  styleUrl: './medicine-add.component.css'
})
export class MedicineAddComponent {
  newMedicine: CreateMedicineDTO = {
    medicineType: '',
    medicineName: '',
    genericName: '',
    company: ''
  };
  errorMessage: string = '';

  constructor(private medicineService: MedicineService, private router: Router) { }

  addMedicine(): void {
    this.medicineService.create(this.newMedicine).subscribe(
      (response) => {
        console.log('Medicine added successfully:', response);
        this.router.navigate(['/medicines']); // Navigate back to the list
      },
      (error) => {
        this.errorMessage = 'Error adding medicine: ' + error;
        console.error(this.errorMessage);
      }
    );
  }

  cancel(): void {
    this.router.navigate(['/medicines']);
  }
}
