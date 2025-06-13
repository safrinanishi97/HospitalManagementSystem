
// import { Component, OnInit } from '@angular/core';
// import { Router, RouterLink } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { PrescriptionDTO } from '../../../models/prescription-dto';
// import { PrescriptionService } from '../../../services/prescription.service';

// @Component({
//   selector: 'app-prescription-list',
//   standalone: true,
//   imports: [CommonModule, RouterLink],
//   templateUrl: './prescription-list.component.html',
//   styleUrls: ['./prescription-list.component.css']
// })
// export class PrescriptionListComponent implements OnInit {
//   prescriptions: PrescriptionDTO[] = [];

//   constructor(private prescriptionService: PrescriptionService) {}

//   ngOnInit(): void {
//     this.loadPrescriptions();
//   }

//   loadPrescriptions(): void {
//     this.prescriptionService.getPrescriptions().subscribe(data => this.prescriptions = data);
//   }

//   deletePrescription(id: number): void {
//     if (confirm('Are you sure you want to delete this prescription?')) {
//       this.prescriptionService.deletePrescription(id).subscribe({
//         next: () => this.loadPrescriptions(),
//         error: (err) => alert('Failed to delete prescription: ' + err.message)
//       });
//     }
//   }
// }



import { Component, OnInit } from '@angular/core';

import { Router, RouterLink } from '@angular/router';
import { PrescriptionListDTO } from '../../../models/prescription-dto';
import { PrescriptionService } from '../../../services/prescription.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-prescription-list',
   standalone: true,
   imports: [CommonModule, RouterLink],
  templateUrl: './prescription-list.component.html',
  styleUrls: ['./prescription-list.component.css']
})
export class PrescriptionListComponent implements OnInit {
  prescriptions: PrescriptionListDTO[] = [];
  isLoading = true;

  constructor(
    private prescriptionService: PrescriptionService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadPrescriptions();
  }

  loadPrescriptions() {
    this.isLoading = true;
    this.prescriptionService.getPrescriptions().subscribe({
      next: (data) => {
        this.prescriptions = data;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  viewDetails(id: number) {
    this.router.navigate(['/prescriptions', id]);
  }

  createNew() {
    this.router.navigate(['/prescriptions/create']);
  }

  deletePrescription(id: number) {
    if (confirm('Are you sure you want to delete this prescription?')) {
      this.prescriptionService.deletePrescription(id).subscribe({
        next: () => this.loadPrescriptions()
      });
    }
  }
}





