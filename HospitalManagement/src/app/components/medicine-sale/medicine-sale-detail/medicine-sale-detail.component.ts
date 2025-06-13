import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, RouterLink } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MedicineSaleDTO } from '../../../models/medicine-sale-dto';
import { MedicineDTO } from '../../../models/medicine-dto';
import { MedicineSaleService } from '../../../services/medicine-sale.service';
import { MedicineService } from '../../../services/medicine.service';


@Component({
  selector: 'app-medicine-sale-detail',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './medicine-sale-detail.component.html',
  styleUrl: './medicine-sale-detail.component.css'
})
export class MedicineSaleDetailComponent implements OnInit {
  medicineSale: MedicineSaleDTO | undefined;
  medicine: MedicineDTO | undefined; // Property to hold the specific medicine details
  id: number = 0;

  constructor(
    private route: ActivatedRoute,
    private medicineSaleService: MedicineSaleService,
    private medicineService: MedicineService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.loadMedicineSale();
    });
  }

  loadMedicineSale(): void {
    this.medicineSaleService.getById(this.id).subscribe(
      (data) => {
        this.medicineSale = data;
        this.loadMedicineDetails(data.medicineId); // Load medicine details after getting sale data
      },
      (error) => {
        console.error('Error loading medicine sale:', error);
      }
    );
  }

  loadMedicineDetails(medicineId: number): void {
    this.medicineService.getById(medicineId).subscribe(
      (medicine) => {
        this.medicine = medicine;
      },
      (error) => {
        console.error('Error loading medicine:', error);
      }
    );
  }
}