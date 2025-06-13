// import { Injectable } from '@angular/core';
// import { map, Observable } from 'rxjs';
// import { Doctor } from '../Models/doctor';
// import { Chamber, Patient, TokenDto } from '../Models/token-dto';
// import { HttpClient, HttpParams } from '@angular/common/http';

// @Injectable({
//   providedIn: 'root',
// })
// export class TokenService {
//   constructor(private http: HttpClient) {}
//   apiUrl = 'http://localhost:5068/api/Tokens';

//   // // Get the list of doctors for the dropdown
//   // getDoctors(): Observable<Doctor[]> {
//   //   return this.http.get<Doctor[]>(`${this.apiUrl}/doctors`); // Fixed template literal
//   // }

//   // // Get the list of chambers for the dropdown
//   // getChambers(): Observable<Chamber[]> {
//   //   return this.http.get<Chamber[]>(`${this.apiUrl}/chambers`); // Fixed template literal
//   // }

//   // // Get the list of patients for the dropdown
//   // getPatients(): Observable<Patient[]> {
//   //   return this.http.get<Patient[]>(`${this.apiUrl}/patient`); // Fixed template literal
//   // }

//   // getDoctors(): Observable<Doctor[]> {
//   //   return this.http
//   //     .get<{ data: Doctor[] }>(`${this.apiUrl}/doctors`)
//   //     .pipe(map((res) => res.data)); // Ensure that you're extracting the 'data' array
//   // }

  
//   getChambers(): Observable<Chamber[]> {
//     return this.http
//       .get<{ data: Chamber[] }>(`${this.apiUrl}/chambers`)
//       .pipe(map((res) => res.data)); // Similarly extract data here
//   }

//   getPatients(): Observable<Patient[]> {
//     return this.http
//       .get<{ data: Patient[] }>(`${this.apiUrl}/patient`)
//       .pipe(map((res) => res.data)); // Similarly extract data here
//   }

//   // Create a new token
//   createToken(tokenData: TokenDto): Observable<TokenDto> {
//     return this.http.post<TokenDto>(this.apiUrl, tokenData);
//   }

//   // Get tokens for a specific doctor on a specific date
//   getTokens(doctorId: number, date: Date): Observable<TokenDto[]> {
//     const params = new HttpParams()
//       .set('doctorId', doctorId.toString())
//       .set('date', date.toISOString());

//     return this.http.get<TokenDto[]>(this.apiUrl, { params });
//   }
// }


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Doctor, Chamber, Patient, TokenDto } from '../Models/token-dto';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private apiUrl = 'http://localhost:5068/api/Tokens';

  constructor(private http: HttpClient) {}

  getDoctors(): Observable<Doctor[]> {
    return this.http.get<{ $values: Doctor[] }>(`${this.apiUrl}/doctors`).pipe(
      tap(response => console.log('Doctors Response:', response)),
      map((res) => res?.$values || []), // Ensure that $values is safely accessed
      catchError(error => {
        console.error('Error fetching doctors:', error);
        return of([]); // Return an empty array in case of error
      })
    );
  }
  
  getChambers(): Observable<Chamber[]> {
    return this.http.get<{ $values: Chamber[] }>(`${this.apiUrl}/chambers`).pipe(
      tap(response => console.log('Chambers Response:', response)),
      map((res) => res?.$values || []), // Ensure that $values is safely accessed
      catchError(error => {
        console.error('Error fetching chambers:', error);
        return of([]); // Return an empty array in case of error
      })
    );
  }
  
  getPatients(): Observable<Patient[]> {
    return this.http.get<{ $values: Patient[] }>(`${this.apiUrl}/patient`).pipe(
      tap(response => console.log('Patients Response:', response)),
      map((res) => res?.$values || []), // Ensure that $values is safely accessed
      catchError(error => {
        console.error('Error fetching patients:', error);
        return of([]); // Return an empty array in case of error
      })
    );
  }
  
  createToken(tokenData: TokenDto): Observable<TokenDto> {
    return this.http.post<TokenDto>(this.apiUrl, tokenData);
  }
}
