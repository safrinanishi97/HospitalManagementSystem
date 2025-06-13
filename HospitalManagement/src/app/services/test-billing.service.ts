// services/billing.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { map, Observable } from 'rxjs';
import { TestBilling, TestBillingDTO } from '../models/test-billing';

@Injectable({ providedIn: 'root' })
export class BillingService {
  private apiUrl = 'http://localhost:5068/api/TestBillings';

  constructor(private http: HttpClient) {}

  getAllBillings(): Observable<TestBilling[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      // Change the type to 'any' initially
      map((response) => response.$values as TestBilling[]) // Extract the $values array and cast it
    );
  }

  getBillingById(id: number): Observable<TestBilling> {
    return this.http.get<TestBilling>(`${this.apiUrl}/${id}`);
  }

  createBilling(billing: TestBillingDTO): Observable<TestBilling> {
    return this.http.post<TestBilling>(this.apiUrl, billing);
  }

  updateBilling(id: number, billing: TestBillingDTO): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, billing);
  }

  deleteBilling(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
