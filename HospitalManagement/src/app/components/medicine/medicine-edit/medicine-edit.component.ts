import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UpdateMedicineDTO } from '../../../models/medicine-dto';
import { MedicineService } from '../../../services/medicine.service';

@Component({
  selector: 'app-medicine-edit',
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './medicine-edit.component.html',
  styleUrl: './medicine-edit.component.css'
})
export class MedicineEditComponent implements OnInit {
  medicineId: number | null = null;
  medicine: UpdateMedicineDTO = {
    medicineId: 0,
    medicineType: '',
    medicineName: '',
    genericName: '',
    company: ''
  };
  errorMessage: string = '';
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private medicineService: MedicineService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.medicineId = +params['id'];
      if (this.medicineId) {
        this.loadMedicineToEdit(this.medicineId);
      }
    });
  }

  loadMedicineToEdit(id: number): void {
    this.loading = true;
    this.medicineService.getById(id).subscribe(
      (data) => {
        this.medicine = {
          medicineId: data.medicineId,
          medicineType: data.medicineType,
          medicineName: data.medicineName,
          genericName: data.genericName,
          company: data.company
        };
        this.loading = false;
      },
      (error) => {
        this.errorMessage = 'Error loading medicine for edit: ' + error;
        console.error(this.errorMessage);
        this.loading = false;
      }
    );
  }

  updateMedicine(): void {
    this.loading = true;
    if (this.medicineId) {
      this.medicineService.update(this.medicineId, this.medicine).subscribe(
        (response) => {
          console.log('Medicine updated successfully:', response);
          this.router.navigate(['/medicines']);
          this.loading = false;
        },
        (error) => {
          this.errorMessage = 'Error updating medicine: ' + error;
          console.error(this.errorMessage);
          this.loading = false;
        }
      );
    }
  }

  cancel(): void {
    this.router.navigate(['/medicines']);
  }
}
