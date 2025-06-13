import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AdmissionDTO } from '../Models/admission-dto';

@Injectable({
  providedIn: 'root',
})
export class AdmissionService {
  private baseUrl = 'http://localhost:5068/api/Admissions';

  constructor(private http: HttpClient) {}

  getAdmissions(): Observable<any[]> {
    return this.http.get<any>(this.baseUrl).pipe(
      map((response) => response.$values as any[]) // Extract the array from '$values'
    );
  }

  // Example: Extract data from response that includes $values
  getDoctorsDropdown(): Observable<any[]> {
    return this.http.get<any>(`${this.baseUrl}/DoctorsDropdown`).pipe(
      map((response) => response.$values) // Extract $values array from response
    );
  }

  // Same for other dropdowns, assuming they also return the $values
  getPatientsDropdown(): Observable<any[]> {
    return this.http.get<any>(`${this.baseUrl}/PatientsDropdown`).pipe(
      map((response) => response.$values) // Extract $values
    );
  }

  getBedsDropdown(): Observable<any[]> {
    return this.http.get<any>(`${this.baseUrl}/BedsDropdown`).pipe(
      map((response) => response.$values) // Extract $values
    );
  }

  getAdmission(id: number): Observable<AdmissionDTO> {
    return this.http.get<AdmissionDTO>(`${this.baseUrl}/${id}`);
  }

  addAdmission(admission: AdmissionDTO): Observable<AdmissionDTO> {
    return this.http.post<AdmissionDTO>(this.baseUrl, admission);
  }

  updateAdmission(id: number, admission: AdmissionDTO): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, admission);
  }

  deleteAdmission(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
