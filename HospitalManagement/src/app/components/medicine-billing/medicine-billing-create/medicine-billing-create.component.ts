import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MedicineBillingService } from '../../../services/medicine-billing.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {
  CreateMedicineBilling,
  MedicineBill,
  MedicineBillingList,
  Patient,
} from '../../../models/medicine-billing';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-medicine-billing-create',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './medicine-billing-create.component.html',
  styleUrls: ['./medicine-billing-create.component.css'],
  providers: [DatePipe], // Add DatePipe to providers
})
export class MedicineBillingCreateComponent implements OnInit {
  billingForm: FormGroup;
  patients: Patient[] = [];
  medicineBills: MedicineBill[] = [];

  constructor(
    private fb: FormBuilder,
    private medicineBillingService: MedicineBillingService,
    private router: Router,
    private http: HttpClient,
    private datePipe: DatePipe // Inject DatePipe
  ) {
    this.billingForm = this.fb.group({
      billNo: ['', Validators.required],
      patientId: [null, Validators.required],
      refBy: [''],
      totalAmount: [{ value: 0, disabled: true }],
      discountAmount: [0],
      discountPercentage: [0],
      paidAmount: [0],
      payableAmount: [{ value: 0, disabled: true }], // Added Payable Amount
      dueAmount: [{ value: 0, disabled: true }], // Added Due Amount
      deliveryDate: [null],
      deliveryTime: [''],
      medicineBillingDetails: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.loadPatients();
    this.loadMedicineBills();
    this.addMedicineDetail();
  }

  loadPatients(): void {
    this.medicineBillingService.getPatients().subscribe(
      (data) => {
        this.patients = data;
      },
      (error) => {
        console.error('Error loading patients:', error);
      }
    );
  }

  loadMedicineBills(): void {
    this.medicineBillingService.getMedicineBills().subscribe(
      (data: MedicineBill[]) => {
        this.medicineBills = data;
      },
      (error) => {
        console.error('Error loading medicine bills:', error);
      }
    );
  }

  medicineBillingDetails(): FormArray {
    return this.billingForm.get('medicineBillingDetails') as FormArray;
  }

  newMedicineDetail(): FormGroup {
    return this.fb.group({
      medicineBillId: [null, Validators.required],
      price: [{ value: 0, disabled: true }],
      quantity: [1, Validators.required],
      totalPrice: [{ value: 0, disabled: true }],
    });
  }

  addMedicineDetail(): void {
    this.medicineBillingDetails().push(this.newMedicineDetail());
  }

  removeMedicineDetail(i: number): void {
    this.medicineBillingDetails().removeAt(i);
    this.calculateTotalAmount();
  }

  onMedicineChange(index: number): void {
    const detailForm = this.medicineBillingDetails().controls[
      index
    ] as FormGroup;
    const medicineBillId = detailForm.get('medicineBillId')?.value;
    const selectedMedicine = this.medicineBills.find(
      (m) => m.medicineBillId === medicineBillId
    );
    if (selectedMedicine) {
      detailForm.patchValue({ price: selectedMedicine.price });
      this.calculateDetailTotal(index);
    } else {
      detailForm.patchValue({ price: 0, totalPrice: 0 });
    }
  }

  onQuantityChange(index: number): void {
    this.calculateDetailTotal(index);
  }

  calculateDetailTotal(index: number): void {
    const detailForm = this.medicineBillingDetails().controls[
      index
    ] as FormGroup;
    const price = detailForm.get('price')?.value || 0;
    const quantity = detailForm.get('quantity')?.value || 0;
    detailForm.patchValue({ totalPrice: price * quantity });
    this.calculateTotalAmount();
  }

  calculateTotalAmount(): void {
    let total = 0;
    this.medicineBillingDetails().controls.forEach((control) => {
      total += control.get('totalPrice')?.value || 0;
    });
    this.billingForm.patchValue({ totalAmount: total });
    this.calculatePayableAndDueAmount();
  }

  calculatePayableAndDueAmount(): void {
    const totalAmount = this.billingForm.value.totalAmount || 0;
    const discountAmount = this.billingForm.value.discountAmount || 0;
    const paidAmount = this.billingForm.value.paidAmount || 0;

    const payableAmount = totalAmount - discountAmount;
    const dueAmount = payableAmount - paidAmount;

    this.billingForm.patchValue({ payableAmount, dueAmount });
  }

  onSubmit(): void {
    if (this.billingForm.valid) {
      const deliveryDateFormatted = this.billingForm.value.deliveryDate
        ? this.datePipe.transform(
            this.billingForm.value.deliveryDate,
            'yyyy-MM-dd'
          )
        : null;

      const createBillingDto: CreateMedicineBilling = {
        billNo: this.billingForm.value.billNo,
        patientId: this.billingForm.value.patientId,
        refBy: this.billingForm.value.refBy || null,
        totalAmount: this.billingForm.value.totalAmount,
        discountAmount: this.billingForm.value.discountAmount || null,
        discountPercentage: this.billingForm.value.discountPercentage || null,
        paidAmount: this.billingForm.value.paidAmount || null,
        deliveryTime: this.billingForm.value.deliveryTime || null,
        medicineBillingDetails:
          this.billingForm.value.medicineBillingDetails.map((detail: any) => ({
            medicineBillId: detail.medicineBillId,
            price:
              this.medicineBills.find(
                (m) => m.medicineBillId === detail.medicineBillId
              )?.price || 0,
            quantity: detail.quantity,
          })),
      };

      console.log('createBillingDto:', createBillingDto); // Debug

      this.medicineBillingService
        .createMedicineBilling(createBillingDto)
        .subscribe(
          (response) => {
            console.log('Medicine billing created successfully:', response);
            this.router.navigate(['/medicine-billings']);
          },
          (error) => {
            console.error('Error creating medicine billing:', error);
          }
        );
    } else {
      console.log('Form is invalid');
    }
  }
}
