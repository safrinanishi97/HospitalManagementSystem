import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DoctorService } from '../../../services/doctor.service';
import { Doctor } from '../../../models/doctor';
import { CommonModule, DatePipe } from '@angular/common';
import { LoadingComponent } from '../../loading/loading.component';

@Component({
  selector: 'app-doctor-details',
  templateUrl: './doctor-details.component.html',
  standalone: true,
  imports: [DatePipe, LoadingComponent, CommonModule, RouterLink],
  styleUrls: ['./doctor-details.component.css'],
})
export class DoctorDetailsComponent implements OnInit {
  doctorId!: number;
  doctor: Doctor | null = null;
  isLoading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private doctorService: DoctorService
  ) {}

  ngOnInit(): void {
    this.doctorId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadDoctorDetails();
  }

  loadDoctorDetails(): void {
    this.doctorService.getById(this.doctorId).subscribe({
      next: (data) => {
        if ((data.doctorSchedules as any)?.$values) {
          data.doctorSchedules = (data.doctorSchedules as any).$values;
        }
        if ((data.doctorChambers as any)?.$values) {
          data.doctorChambers = (data.doctorChambers as any).$values;
        }
        if ((data.doctorFees as any)?.$values) {
          data.doctorFees = (data.doctorFees as any).$values;
        }

        // 🕒 Format availableTime in doctorChambers
        (data.doctorChambers as any[])?.forEach((chamber) => {
          const date = new Date(`1970-01-01T${chamber.availableTime}`);
          chamber.formattedAvailableTime = date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          });
        });

        // 🕒 Format startTime and endTime in doctorSchedules
        (data.doctorSchedules as any[])?.forEach((schedule) => {
          const start = new Date(`1970-01-01T${schedule.startTime}`);
          const end = new Date(`1970-01-01T${schedule.endTime}`);
          schedule.formattedStartTime = start.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          });
          schedule.formattedEndTime = end.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          });
        });

        this.doctor = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load doctor details.';
        this.isLoading = false;
        console.error(err);
      },
    });
  }
}
