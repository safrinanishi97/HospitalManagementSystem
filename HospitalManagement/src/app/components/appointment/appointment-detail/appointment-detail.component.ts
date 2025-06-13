import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { AppointmentService } from '../../../services/appointment.service';
import { Appointment, AppointmentDTO } from '../../../models/appointment-dto';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LoadingComponent } from '../../loading/loading.component';

@Component({
  selector: 'app-appointment-detail',
  standalone: true,
  imports: [DatePipe, LoadingComponent, CommonModule, RouterLink],
  templateUrl: './appointment-detail.component.html',
  styleUrl: './appointment-detail.component.css',
})
export class AppointmentDetailComponent {
  // appointment!: AppointmentDTO;
  appointment: Appointment | null = null;
  isLoading = true;

  constructor(
    private appointmentService: AppointmentService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadAppointment(+id);
    }
  }

  loadAppointment(id: number): void {
    this.appointmentService.getAppointmentById(id).subscribe({
      next: (data) => {
        this.appointment = data;

        console.log(data);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading appointment', err);
        this.isLoading = false;
      },
    });
  }

  deleteAppointment(): void {
    if (
      this.appointment &&
      confirm('Are you sure you want to delete this appointment?')
    ) {
      this.appointmentService
        .deleteAppointment(this.appointment.appointmentId)
        .subscribe({
          next: () => {
            this.router.navigate(['/appointment']);
          },
          error: (err) => console.error('Error deleting appointment', err),
        });
    }
  }
}
