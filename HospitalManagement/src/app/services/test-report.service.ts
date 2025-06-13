// services/test-report.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map, Observable } from 'rxjs';
import { TestReport, TestReportDTO } from '../models/test-report';

@Injectable({ providedIn: 'root' })
export class TestReportService {
  private apiUrl = 'http://localhost:5068/api/TestReports';

  constructor(private http: HttpClient) {}

  getAllReports(): Observable<TestReport[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      // Change the type to 'any' initially
      map((response) => response.$values as TestReport[]) // Extract the $values array and cast it
    );
  }

  getReportById(id: number): Observable<TestReport> {
    return this.http.get<TestReport>(`${this.apiUrl}/${id}`);
  }

  createReport(report: TestReportDTO): Observable<TestReport> {
    return this.http.post<TestReport>(this.apiUrl, report);
  }

  updateReport(id: number, report: TestReportDTO): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, report);
  }

  deleteReport(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
