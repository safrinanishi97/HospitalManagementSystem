import { Component, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { MedicineProfitDTO } from '../../../models/medicine-profit-dto';
import { MedicineProfitService } from '../../../services/medicine-profit.service';

@Component({
  selector: 'app-medicine-profit-list',
  imports: [CommonModule, RouterLink, FormsModule, DatePipe],
  templateUrl: './medicine-profit-list.component.html',
  styleUrl: './medicine-profit-list.component.css',
  providers: [DatePipe]
})
export class MedicineProfitListComponent implements OnInit {
  medicineProfits: MedicineProfitDTO[] = [];
  loading = true;
  error = '';

  constructor(
    private medicineProfitService: MedicineProfitService,
    private datePipe: DatePipe // Inject DatePipe
  ) { }

  ngOnInit(): void {
    this.loadMedicineProfits();
  }

  loadMedicineProfits(): void {
    this.loading = true;
    this.medicineProfitService.getAll().subscribe({
      next: (data) => {
        this.medicineProfits = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error loading medicine profits.';
        console.error('Error loading medicine profits:', error);
        this.loading = false;
      }
    });
  }

  getMedicineName(profit: MedicineProfitDTO): string {
    // Access medicine name through the medicineSale relationship
    return profit.medicineSale?.medicine?.medicineName || 'Unknown';
  }

  formatDate(date: Date | null): string {
    if (!date) return '';
    return this.datePipe.transform(date, 'yyyy-MM-dd') || ''; // Format date
  }

  deleteMedicineProfit(id: number): void {
    if (confirm('Are you sure you want to delete this profit record?')) {
      this.medicineProfitService.delete(id).subscribe({
        next: () => {
          this.loadMedicineProfits(); // Reload the list after successful deletion
        },
        error: (error) => {
          this.error = 'Error deleting medicine profit.';
          console.error('Error deleting medicine profit:', error);
        }
      });
    }
  }
 }