import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MedicineBillingList } from '../../../models/medicine-billing';
import { MedicineBillingService } from '../../../services/medicine-billing.service';

@Component({
  selector: 'app-medicine-billing-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './medicine-billing-list.component.html',
  styleUrl: './medicine-billing-list.component.css',
})
export class MedicineBillingListComponent implements OnInit {
  medicineBillings: MedicineBillingList[] = [];

  constructor(private medicineBillingService: MedicineBillingService) {}

  ngOnInit(): void {
    this.loadMedicineBillings();
  }

  loadMedicineBillings(): void {
    this.medicineBillingService.getMedicineBillings().subscribe(
      (data) => {
        this.medicineBillings = data;
      },
      (error) => {
        console.error('Error loading medicine billings:', error);
      }
    );
  }
}
