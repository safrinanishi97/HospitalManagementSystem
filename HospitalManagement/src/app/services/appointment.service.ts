import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Appointment, AppointmentDTO } from '../models/appointment-dto';
import { Observable } from 'rxjs';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private apiUrl = `${environment.apiUrl}/api/appointments`;

  constructor(private http: HttpClient) {}

  // getAppointments(): Observable<Appointment[]> {
  //   return this.http.get<Appointment[]>(this.apiUrl);
  // }
  //Here fix this for object:

  getAppointments(): Observable<{ $values: Appointment[] }> {
    return this.http.get<{ $values: Appointment[] }>(this.apiUrl);
  }

  getAppointmentById(id: number): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.apiUrl}/${id}`);
  }

  createAppointment(appointment: AppointmentDTO): Observable<Appointment> {
    return this.http.post<Appointment>(
      `${this.apiUrl}/create-with-patient`,
      appointment
    );
  }

  updateAppointment(id: number, appointment: AppointmentDTO): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, appointment);
  }

  deleteAppointment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
