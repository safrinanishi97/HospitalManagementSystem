import { Component, OnInit } from '@angular/core';
import { BillingService } from '../../../services/test-billing.service';
import { TestBilling } from '../../../models/test-billing';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-billing-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './billing-list.component.html',
  styleUrl: './billing-list.component.css'
})
export class BillingListComponent implements OnInit {
  billings: TestBilling[] = [];
  isLoading = true;

  constructor(
    private billingService: BillingService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadBillings();
  }

  loadBillings() {
    this.billingService.getAllBillings().subscribe({
      next: (data) => {
        this.billings = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading billings', err);
        this.isLoading = false;
      }
    });
  }

  navigateToCreate() {
    this.router.navigate(['/billings/create']);
  }

  navigateToEdit(id: number) {
    this.router.navigate(['/billings/edit', id]);
  }

  deleteBilling(id: number) {
    if (confirm('Are you sure you want to delete this billing?')) {
      this.billingService.deleteBilling(id).subscribe({
        next: () => this.loadBillings(),
        error: (err) => console.error('Error deleting billing', err)
      });
    }
  }
}