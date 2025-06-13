import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { DoctorService } from '../../../services/doctor.service';
import { Doctor } from '../../../models/doctor';

@Component({
  selector: 'app-doctor-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './doctor-list.component.html',
  styleUrl: './doctor-list.component.css',
})
export class DoctorListComponent implements OnInit {
  doctors: Doctor[] = [];

  constructor(private doctorService: DoctorService) {}

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors() {
    this.doctorService.getAll().subscribe((data) => {
      console.log('Doctors:', data);
      this.doctors = data;
    });
  }

  deleteDoctor(id: number) {
    if (confirm('Are you sure to delete this doctor?')) {
      this.doctorService.delete(id).subscribe(() => this.loadDoctors());
    }
  }
}
