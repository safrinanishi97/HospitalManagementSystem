import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Doctor } from '../models/doctor';

@Injectable({
  providedIn: 'root',
})
export class DoctorService {
  constructor(private http: HttpClient) {}
  apiUrl = 'http://localhost:5068/api/Doctors';

  getAll(): Observable<Doctor[]> {
    return this.http
      .get<any>(this.apiUrl)
      .pipe(map((response) => response.$values as Doctor[]));
  }

  getById(id: number): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.apiUrl}/${id}`);
  }

  create(doctor: Doctor): Observable<any> {
    const formData = this.toFormData(doctor);
    return this.http.post(this.apiUrl, formData);
  }

  update(id: number, doctor: Doctor): Observable<any> {
    const formData = this.toFormData(doctor);
    return this.http.put(`${this.apiUrl}/${id}`, formData);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  private toFormData(doctor: Doctor): FormData {
    const formData = new FormData();
    formData.append('DoctorId', doctor.doctorId.toString());
    formData.append('FirstName', doctor.firstName);
    formData.append('LastName', doctor.lastName);
    formData.append('DepartmentId', doctor.departmentId.toString());
    if (doctor.specializationId !== undefined)
      formData.append('SpecializationId', doctor.specializationId.toString());
    if (doctor.phone) formData.append('Phone', doctor.phone);
    if (doctor.email) formData.append('Email', doctor.email);
    formData.append('departmentName', doctor.departmentName ?? '');
    formData.append('specializationName', doctor.specializationName ?? '');
    if (doctor.imageFile) formData.append('ImageFile', doctor.imageFile);
    return formData;
  }

  createWithFormData(formData: FormData) {
    return this.http.post('http://localhost:5068/api/doctors', formData);
  }

  updateWithFormData(id: number, formData: FormData) {
    return this.http.put(`http://localhost:5068/api/doctors/${id}`, formData);
  }
}
