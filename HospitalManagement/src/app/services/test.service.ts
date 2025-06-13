import { Injectable } from '@angular/core';
import { TestDTO } from '../models/test-dto';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  private apiUrl = 'http://localhost:5068/api/Tests'; // Update with your API URL

  constructor(private http: HttpClient) { }

  // getTests(): Observable<TestDTO[]> { // Note the array type
  //   return this.http.get<TestDTO[]>(this.apiUrl);
  // }

  // getPatients(): Observable<TestDTO[]> {
  //   return this.http.get<any>(this.apiUrl).pipe(
  //     // Change the type to 'any' initially
  //     map((response) => response.$values as TestDTO[]) // Extract the $values array and cast it
  //   );
  // }

  getTests(): Observable<TestDTO[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => {
        // Handle OData-style response with $values
        if (response && response.$values) {
          return response.$values as TestDTO[];
        }
        // Handle direct array response
        if (Array.isArray(response)) {
          return response as TestDTO[];
        }
        // Handle empty or unexpected responses
        console.warn('Unexpected API response format:', response);
        return [];
      }),
      catchError(error => {
        console.error('Error fetching tests:', error);
        return throwError(() => new Error('Failed to load tests'));
      })
    );
  }

  getTest(id: number): Observable<TestDTO> {
    return this.http.get<TestDTO>(`${this.apiUrl}/${id}`);
  }

  createTest(test: Omit<TestDTO, 'testId'>): Observable<TestDTO> {
    return this.http.post<TestDTO>(this.apiUrl, test);
  }

  updateTest(test: TestDTO): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${test.testId}`, test);
  }

  deleteTest(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
