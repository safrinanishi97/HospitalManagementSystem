import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MedicineBilling } from '../../../models/medicine-billing';
import { MedicineBillingService } from '../../../services/medicine-billing.service';

@Component({
  selector: 'app-medicine-billing-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './medicine-billing-detail.component.html',
  styleUrl: './medicine-billing-detail.component.css',
})
export class MedicineBillingDetailComponent implements OnInit {
  medicineBillingId: number = 0;
  medicineBilling: MedicineBilling | null = null;

  constructor(
    private route: ActivatedRoute,
    private medicineBillingService: MedicineBillingService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.medicineBillingId = +params['id']; // (+) converts string 'id' to a number
      this.loadMedicineBillingDetails(this.medicineBillingId);
    });
  }

  loadMedicineBillingDetails(id: number): void {
    this.medicineBillingService.getMedicineBilling(id).subscribe(
      (data) => {
        this.medicineBilling = data;
      },
      (error) => {
        console.error('Error loading medicine billing details:', error);
      }
    );
  }
}
