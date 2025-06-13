import { Component, inject, OnInit } from '@angular/core';

import { ActivatedRoute, RouterLink } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { MedicineLossDTO } from '../../../models/medicine-loss-dto';
import { MedicinePurchaseDTO } from '../../../models/medicine-purchase-dto';
import { MedicineLossService } from '../../../services/medicine-loss.service';
import { MedicinePurchaseService } from '../../../services/medicine-purchase.service';


@Component({
  selector: 'app-medicine-loss-detail',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './medicine-loss-detail.component.html',
  styleUrl: './medicine-loss-detail.component.css'
})
export class MedicineLossDetailComponent implements OnInit {
  medicineLoss: MedicineLossDTO | undefined;
  medicinePurchase: MedicinePurchaseDTO | undefined; // To hold purchase details
  loading = true;
  error = '';
  medicineName = 'Loading...';

  private route = inject(ActivatedRoute);
  private medicineLossService = inject(MedicineLossService);
  private medicinePurchaseService = inject(MedicinePurchaseService); // Inject MedicinePurchaseService
  private location = inject(Location);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadMedicineLoss(id);
    } else {
      this.error = 'Invalid medicine loss ID.';
      this.loading = false;
    }
  }

  loadMedicineLoss(id: number): void {
    this.loading = true;
    this.medicineLossService.getById(id).subscribe({
      next: (data) => {
        this.medicineLoss = data;
        this.medicineName = data.medicinePurchase?.medicine?.medicineName || 'Unknown Medicine';
        if (data.medicinePurchaseId) {
          this.loadMedicinePurchase(data.medicinePurchaseId); // Load purchase details
        } else {
          this.loading = false;
        }
      },
      error: (error) => {
        this.error = 'Error loading medicine loss details.';
        console.error('Error loading medicine loss details:', error);
        this.loading = false;
      }
    });
  }

  loadMedicinePurchase(purchaseId: number): void {
    this.medicinePurchaseService.getById(purchaseId).subscribe({
      next: (purchaseData) => {
        this.medicinePurchase = purchaseData;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading medicine purchase details:', error);
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.location.back();
  }
}