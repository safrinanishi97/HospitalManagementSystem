import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PrescriptionDTO } from '../../../models/prescription-dto';
import { PrescriptionService } from '../../../services/prescription.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-prescription-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './prescription-detail.component.html',
  styleUrls: ['./prescription-detail.component.css'],
})
export class PrescriptionDetailComponent implements OnInit {
  prescription!: PrescriptionDTO;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private prescriptionService: PrescriptionService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.loadPrescription(id);
  }

  // Utility function to safely extract values
  private extractValues<T>(data: any): T[] {
    return Array.isArray(data) ? data : data?.$values ?? [];
  }

  loadPrescription(id: number) {
    this.isLoading = true;
    this.prescriptionService.getPrescription(id).subscribe({
      next: (data) => {
        console.log('Prescription API Response:', data);

        // Use the utility function for all arrays
        data.prescriptionMedicines = this.extractValues(
          data.prescriptionMedicines
        );
        data.prescriptionTests = this.extractValues(data.prescriptionTests);
        data.prescriptionDiagnoses = this.extractValues(
          data.prescriptionDiagnoses
        );
        data.prescriptionAdvices = this.extractValues(data.prescriptionAdvices);
        data.physicalSymptoms = this.extractValues(data.physicalSymptoms);

        this.prescription = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.router.navigate(['/prescriptions']);
      },
    });
  }

  editPrescription() {
    this.router.navigate([
      '/prescriptions',
      this.prescription.prescriptionId,
      'edit',
    ]);
  }

  printPrescription() {
    window.print();
  }
}
