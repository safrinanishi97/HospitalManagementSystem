import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, RouterLink } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MedicineDTO } from '../../../models/medicine-dto';
import { MedicineService } from '../../../services/medicine.service';

@Component({
  selector: 'app-medicine-detail',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './medicine-detail.component.html',
  styleUrl: './medicine-detail.component.css'
})
export class MedicineDetailComponent implements OnInit {
  medicineId: number | null = null;
  medicine: MedicineDTO | null = null;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private medicineService: MedicineService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.medicineId = +params['id']; // (+) converts string 'id' to a number
      if (this.medicineId) {
        this.loadMedicineDetails(this.medicineId);
      }
    });
  }

  loadMedicineDetails(id: number): void {
    this.medicineService.getById(id).subscribe(
      (data) => {
        this.medicine = data;
      },
      (error) => {
        this.errorMessage = 'Error loading medicine details: ' + error;
        console.error(this.errorMessage);
      }
    );
  }
}
