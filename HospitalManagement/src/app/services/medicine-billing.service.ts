import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  CreateMedicineBilling,
  MedicineBill,
  MedicineBilling,
  MedicineBillingList,
  UpdateMedicineBilling,
} from '../models/medicine-billing';
import { Patient } from '../Models/token-dto';

@Injectable({
  providedIn: 'root',
})
export class MedicineBillingService {
  private apiUrl = 'http://localhost:5068/api/MedicineBilling'; // Adjust if your API URL is different

  constructor(private http: HttpClient) {}

  private handleError(error: any) {
    // Improved error handling
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status},  Message: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }

  getMedicineBillings(): Observable<MedicineBillingList[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((response) => response.$values as MedicineBillingList[]),
      catchError(this.handleError) // Include error handling here
    );
  }

  getMedicineBills(): Observable<MedicineBill[]> {
    return this.http.get<any>('http://localhost:5068/api/MedicineBill').pipe(
      map((response) => response.$values as MedicineBill[]),
      catchError(this.handleError)
    );
  }

  getMedicineBilling(id: number): Observable<MedicineBilling> {
    return this.http
      .get<MedicineBilling>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  createMedicineBilling(
    medicineBilling: CreateMedicineBilling
  ): Observable<MedicineBilling> {
    return this.http
      .post<MedicineBilling>(`${this.apiUrl}`, medicineBilling)
      .pipe(catchError(this.handleError));
  }

  updateMedicineBilling(
    id: number,
    medicineBilling: UpdateMedicineBilling
  ): Observable<MedicineBilling> {
    return this.http
      .put<any>(`${this.apiUrl}/${id}`, medicineBilling)
      .pipe(catchError(this.handleError));
  }

  deleteMedicineBilling(id: number): Observable<any> {
    return this.http
      .delete<any>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  getPatients(): Observable<Patient[]> {
    return this.http
      .get<any>('http://localhost:5068/api/Patients') // Corrected URL.  Make sure this is right.
      .pipe(
        map((response) => response.$values as Patient[]), // Extract from $values
        catchError(this.handleError)
      );
  }

  getMedicineBillsByPatientId(
    patientId: number
  ): Observable<MedicineBillingList[]> {
    const params = new HttpParams().set('patientId', patientId.toString());
    return this.http
      .get<any>(`${this.apiUrl}/GetByPatientId`, { params: params })
      .pipe(
        map((response) => response.$values as MedicineBillingList[]),
        catchError(this.handleError)
      );
  }
}
