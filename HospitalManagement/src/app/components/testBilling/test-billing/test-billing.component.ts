import { Component } from '@angular/core';
import {
  TestBilling,
  TestBillingDetailDTO,
  TestBillingDTO,
} from '../../../models/test-billing';
import { BillingService } from '../../../services/test-billing.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

interface BillingCalculations {
  total: number;
  payable: number;
  due: number;
}

@Component({
  selector: 'app-test-billing',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './test-billing.component.html',
  styleUrl: './test-billing.component.css',
})
export class TestBillingComponent {
  billings: TestBilling[] = [];
  selectedBilling: TestBilling = this.createEmptyBilling();
  newBilling: TestBillingDTO = {
    billNo: this.generateBillNo(),
    patientId: 0,
    discountAmount: 0,
    discountPercentage: 0,
    paidAmount: 0,
    deliveryDate: new Date(),
    deliveryTime: '10:00',
    testBillingDetails: [],
  };
  newDetail: TestBillingDetailDTO = { testId: 0, price: 0, quantity: 1 };
  isLoading = true;

  constructor(private billingService: BillingService) {}

  ngOnInit() {
    this.loadBillings();
  }

  createEmptyBilling(): TestBilling {
    return {
      billNo: this.generateBillNo(),
      patientId: 0,
      discountPercentage: 0,
      discountAmount: 0,
      paidAmount: 0,
      totalAmount: 0,
      payableAmount: 0,
      dueAmount: 0,
      deliveryDate: new Date(),
      deliveryTime: '10:00',
      testBillingDetails: [],
    };
  }

  generateBillNo(): string {
    return 'BL-' + Date.now().toString().slice(-6);
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
      },
    });
  }

  selectBilling(billing: TestBilling) {
    this.selectedBilling = { ...billing };
  }

  // For new billing
  addDetail() {
    this.newBilling.testBillingDetails.push({ ...this.newDetail });
    this.newDetail = { testId: 0, price: 0, quantity: 1 };
    this.calculateTotals();
  }

  removeDetail(index: number) {
    this.newBilling.testBillingDetails.splice(index, 1);
    this.calculateTotals();
  }

  calculateTotals(): BillingCalculations {
    const total = this.newBilling.testBillingDetails.reduce(
      (sum, d) => sum + d.price * d.quantity,
      0
    );
    const discount = total * (this.newBilling.discountPercentage / 100);
    this.newBilling.discountAmount = discount;
    return {
      total,
      payable: total - discount,
      due: total - discount - this.newBilling.paidAmount,
    };
  }

  // For editing existing billing
  addDetailToEdit() {
    if (!this.selectedBilling.testBillingDetails) {
      this.selectedBilling.testBillingDetails = [];
    }
    this.selectedBilling.testBillingDetails.push({ ...this.newDetail });
    this.newDetail = { testId: 0, price: 0, quantity: 1 };
    this.updateEditCalculations();
  }

  removeDetailFromEdit(index: number) {
    if (this.selectedBilling.testBillingDetails) {
      this.selectedBilling.testBillingDetails.splice(index, 1);
      this.updateEditCalculations();
    }
  }

  getEditTotal(): number {
    if (!this.selectedBilling || !this.selectedBilling.testBillingDetails)
      return 0;
    return this.selectedBilling.testBillingDetails.reduce(
      (sum, d) => sum + d.price * d.quantity,
      0
    );
  }

  getEditPayable(): number {
    const total = this.getEditTotal();
    const discount = (this.selectedBilling?.discountPercentage || 0) / 100;
    return total - total * discount;
  }

  getEditDue(): number {
    const payable = this.getEditPayable();
    return payable - (this.selectedBilling?.paidAmount || 0);
  }

  updateEditCalculations(): void {
    if (!this.selectedBilling) return;
    const total = this.getEditTotal();
    const discount = (this.selectedBilling.discountPercentage || 0) / 100;
    const discountAmount = total * discount;
    this.selectedBilling.discountAmount = discountAmount;
  }

  createBilling() {
    this.billingService.createBilling(this.newBilling).subscribe({
      next: () => {
        this.loadBillings();
        this.newBilling = {
          billNo: this.generateBillNo(),
          patientId: 0,
          discountAmount: 0,
          discountPercentage: 0,
          paidAmount: 0,
          deliveryDate: new Date(),
          deliveryTime: '10:00',
          testBillingDetails: [],
        };
      },
      error: (err) => console.error('Error creating billing', err),
    });
  }

  updateBilling() {
    this.billingService
      .updateBilling(this.selectedBilling.testBillingId!, this.selectedBilling)
      .subscribe({
        next: () => {
          this.loadBillings();
          this.selectedBilling = this.createEmptyBilling(); // Reset to empty instead of null
        },
        error: (err) => console.error('Error updating billing', err),
      });
  }

  deleteBilling(id: number) {
    if (confirm('Are you sure you want to delete this billing?')) {
      this.billingService.deleteBilling(id).subscribe({
        next: () => this.loadBillings(),
        error: (err) => console.error('Error deleting billing', err),
      });
    }
  }
}
