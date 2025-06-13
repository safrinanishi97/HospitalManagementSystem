import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { MedicineProfitDTO } from '../../../models/medicine-profit-dto';
import { MedicineSaleDTO } from '../../../models/medicine-sale-dto';
import { MedicineProfitService } from '../../../services/medicine-profit.service';
import { MedicineSaleService } from '../../../services/medicine-sale.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-medicine-profit-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, CurrencyPipe],
  templateUrl: './medicine-profit-detail.component.html',
  styleUrl: './medicine-profit-detail.component.css'
})
export class MedicineProfitDetailComponent implements OnInit {
  medicineProfit: MedicineProfitDTO | undefined;
  medicineSale: MedicineSaleDTO | undefined;
  loading = true;
  error = '';
  medicineName = 'Loading...';

  private route = inject(ActivatedRoute);
  private medicineProfitService = inject(MedicineProfitService);
  private medicineSaleService = inject(MedicineSaleService);
  private location = inject(Location);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadMedicineProfit(id);
    } else {
      this.error = 'Invalid medicine profit ID.';
      this.loading = false;
    }
  }

  loadMedicineProfit(id: number): void {
    this.loading = true;
    this.medicineProfitService.getById(id).subscribe({
      next: (data) => {
        this.medicineProfit = data;
        this.medicineName = data.medicineSale?.medicine?.medicineName || 'Unknown Medicine';
        if (data.medicineSaleId) {
          this.loadMedicineSale(data.medicineSaleId);
        } else {
          this.loading = false;
        }
      },
      error: (error) => {
        this.error = 'Error loading medicine profit details.';
        console.error('Error loading medicine profit details:', error);
        this.loading = false;
      }
    });
  }

  loadMedicineSale(saleId: number): void {
    this.medicineSaleService.getById(saleId).subscribe({
      next: (saleData) => {
        this.medicineSale = saleData;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading medicine sale details:', error);
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.location.back();
  }
}