import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  AppointmentDTO,
  AppointmentStatus,
  AppointmentType,
  Gender,
  VisitType,
} from '../../../models/appointment-dto';
import { AppointmentService } from '../../../services/appointment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-appointment-edit',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './appointment-edit.component.html',
  styleUrl: './appointment-edit.component.css',
})
export class AppointmentEditComponent {
  appointment: AppointmentDTO | null = null;

  Gender = Gender;
  AppointmentStatus = AppointmentStatus;
  AppointmentType = AppointmentType;
  VisitType = VisitType;
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
      next: (data: any) => {
        this.appointment = {
          appointmentId: data.appointmentId,
          patientNo: '',
          firstName: '',
          lastName: '',
          age: 0,
          gender: data.gender || Gender.Male,
          patientId: data.patientId,
          doctorId: data.doctorId,
          admissionId: data.admissionId || null,
          tokenId: data.tokenId || null,
          appointmentDate: data.appointmentDate,
          patientPhone: data.patientPhone || null,
          referralCode: data.referralCode || null,
          appointmentStatus:
            data.appointmentStatus || AppointmentStatus.Scheduled,
          appointmentType: data.appointmentType || AppointmentType.General,
          visitType: data.visitType ?? VisitType.FirstVisit,
        };
      },
      error: (err) => console.error('Error loading appointment', err),
    });
  }

  onSubmit(): void {
    if (!this.appointment?.appointmentId) return;

    const { appointmentId } = this.appointment;

    this.appointmentService
      .updateAppointment(appointmentId, this.appointment)
      .subscribe({
        next: () => {
          this.router.navigate(['/appointment']);
        },
        error: (err) => console.error('Error updating appointment', err),
      });
  }

  getEnumOptions(enumObj: any): { key: string; value: any }[] {
    return Object.keys(enumObj)
      .filter((key) => isNaN(Number(key)))
      .map((key) => ({ key, value: enumObj[key] }));
  }
}
