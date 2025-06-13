import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AdmissionService } from '../../../services/admission.service';
import { AdmissionDTO } from '../../../Models/admission-dto';


@Component({
  selector: 'app-admission-list',
  imports: [CommonModule,RouterLink],
  templateUrl: './admission-list.component.html',
  styleUrl: './admission-list.component.css',
})
export class AdmissionListComponent implements OnInit {
  admissions: AdmissionDTO[] = [];

  constructor(private admissionService: AdmissionService) {}

  ngOnInit(): void {
    this.getAdmissions();
  }

  getAdmissions(): void {
    this.admissionService.getAdmissions().subscribe({
      next: (data) => (this.admissions = data),
      error: (err) => console.error(err),
    });
  }

  deleteAdmission(id: number): void {
    this.admissionService.deleteAdmission(id).subscribe({
      next: () => this.getAdmissions(),
      error: (err) => console.error(err),
    });
  }
}
