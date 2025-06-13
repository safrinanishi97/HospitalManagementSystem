import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppointmentService } from '../../../services/appointment.service';
import { Appointment } from '../../../models/appointment-dto';
import { LoadingComponent } from '../../loading/loading.component';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [RouterLink, DatePipe, LoadingComponent, CommonModule],
  templateUrl: './appointment-list.component.html',
  styleUrl: './appointment-list.component.css',
})
export class AppointmentListComponent {
  appointments: Appointment[] = [];
  isLoading = true;

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.appointmentService.getAppointments().subscribe({
      next: (data) => {
        console.log('API returned:', data);
        console.log('Type of data:', typeof data);
        // this.appointments = data;
        this.appointments = data.$values;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading appointments', err);
        this.isLoading = false;
      },
    });
  }

  deleteAppointment(id: number): void {
    if (confirm('Are you sure you want to delete this appointment?')) {
      this.appointmentService.deleteAppointment(id).subscribe({
        next: () => {
          this.appointments = this.appointments.filter(
            (a) => a.appointmentId !== id
          );
        },
        error: (err) => console.error('Error deleting appointment', err),
      });
    }
  }
}
