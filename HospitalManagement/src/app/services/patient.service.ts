import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import { catchError, map } from 'rxjs/operators'; // Import the map operator
import {
  ChamberDropdown,
  DoctorDropdown,
  PatientCreate,
  PatientRead,
  PatientUpdate,
  PatientWithToken,
} from '../models/PatientDTO';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  constructor(private http: HttpClient) {}
  apiUrl = 'http://localhost:5068/api/Patients';

  // getPatients(): Observable<Patient[]> {
  //   return this.http.get<any>(this.apiUrl).pipe(
  //     map((response) => response.$values as Patient[])
  //   );
  // }

  getPatients(): Observable<PatientRead[]> {
    return this.http
      .get<any>(this.apiUrl)
      .pipe(map((response) => response.$values as PatientRead[]));
  }

  getPatient(id: number): Observable<PatientWithToken> {
    return this.http.get<PatientWithToken>(`${this.apiUrl}/${id}`);
  }

  createPatient(patient: PatientCreate): Observable<PatientWithToken> {
    return this.http.post<PatientWithToken>(this.apiUrl, patient);
  }

  updatePatient(id: number, patient: PatientUpdate): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, patient);
  }

  deletePatient(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getDoctorsDropdown(): Observable<DoctorDropdown[]> {
    return this.http
      .get<any>(`${this.apiUrl}/DoctorsDropdown`)
      .pipe(map((response) => response.$values as DoctorDropdown[]));
  }

  getChambersDropdown(): Observable<ChamberDropdown[]> {
    return this.http
      .get<any>(`${this.apiUrl}/ChambersDropdown`)
      .pipe(map((response) => response.$values as ChamberDropdown[]));
  }
}
