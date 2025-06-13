import { Component, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MedicineLossDTO } from '../../../models/medicine-loss-dto';
import { MedicineLossService } from '../../../services/medicine-loss.service';

@Component({
  selector: 'app-medicine-loss-list',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './medicine-loss-list.component.html',
  styleUrl: './medicine-loss-list.component.css'
})
export class MedicineLossListComponent implements OnInit {
  medicineLosses: MedicineLossDTO[] = [];
  loading = true;
  error = '';

  constructor(private medicineLossService: MedicineLossService) { }

  ngOnInit(): void {
    this.loadMedicineLosses();
  }

  loadMedicineLosses(): void {
    this.loading = true;
    this.medicineLossService.getAll().subscribe({
      next: (data) => {
        this.medicineLosses = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error loading medicine losses.';
        console.error('Error loading medicine losses:', error);
        this.loading = false;
      }
    });
  }

  getMedicineName(loss: MedicineLossDTO): string {
    return loss.medicinePurchase?.medicine?.medicineName || 'Unknown Medicine';
  }

  deleteMedicineLoss(id: number): void {
    if (confirm('Are you sure you want to delete this loss record?')) {
      this.medicineLossService.delete(id).subscribe({
        next: () => {
          this.loadMedicineLosses();
        },
        error: (error) => {
          this.error = 'Error deleting medicine loss.';
          console.error('Error deleting medicine loss:', error);
        }
      });
    }
  }
}