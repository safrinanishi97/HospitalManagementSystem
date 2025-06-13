// import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { catchError, map, Observable, of, throwError } from 'rxjs';
// import { PrescriptionDTO, PrescriptionFormData } from '../models/prescription-dto';

// @Injectable({
//   providedIn: 'root'
// })
// export class PrescriptionService {
//   private apiUrl = 'http://localhost:5068/api/Prescriptions';

//   constructor(private http: HttpClient) { }

//   // getPrescriptions(): Observable<PrescriptionDTO[]> {
//   //   return this.http.get<any>(this.apiUrl).pipe(
     
//   //     map((response) => response.$values as PrescriptionDTO[]),
//   //     catchError(error => {
//   //       console.error('API Error:', error);
//   //       return throwError(() => error);
//   //     })
//   //   );
//   // }
//   getPrescriptions(): Observable<PrescriptionDTO[]> {
//     return this.http.get<any>(this.apiUrl).pipe(
//       map((response) => {
//         // Handle both array response and object with $values property
//         return Array.isArray(response) ? response : (response.$values || []);
//       }),
//       catchError(error => {
//         console.error('API Error:', error);
//         return throwError(() => error);
//       })
//     );
//   }

//   getPrescription(id: number): Observable<PrescriptionDTO> {
//     return this.http.get<PrescriptionDTO>(`${this.apiUrl}/${id}`);
//   }

//   // createPrescription(prescription: PrescriptionDTO): Observable<any> {
//   //   return this.http.post(`${this.apiUrl}`, prescription);
//   // }

//   createPrescription(prescription: PrescriptionDTO): Observable<any> {
//     console.log('Sending prescription:', JSON.stringify(prescription, null, 2));
//     return this.http.post(`${this.apiUrl}`, prescription);
//   }


//   updatePrescription(id: number, prescription: PrescriptionDTO): Observable<any> {
//     return this.http.put(`${this.apiUrl}/${id}`, prescription);
//   }

//   deletePrescription(id: number): Observable<any> {
//     return this.http.delete(`${this.apiUrl}/${id}`);
//   }

//   // getFormData(): Observable<PrescriptionFormData> {
//   //   return this.http.get<any>(`${this.apiUrl}/form-data`).pipe(
//   //     map(response => ({
//   //       doctors: Array.isArray(response.doctors) ? response.doctors : [],
//   //       tokens: Array.isArray(response.tokens) ? response.tokens : [],
//   //       tests: Array.isArray(response.tests) ? response.tests : [],
//   //       medicines: Array.isArray(response.medicines) ? response.medicines : []
//   //     })),
//   //     catchError(error => {
//   //       console.error('Error loading form data:', error);
//   //       return of({
//   //         doctors: [],
//   //         tokens: [],
//   //         tests: [],
//   //         medicines: []
//   //       });
//   //     })
//   //   );
//   // }



//   getFormData(): Observable<PrescriptionFormData> {
//     return this.http.get<any>(`${this.apiUrl}/form-data`).pipe(
//       map(response => ({
//         doctors: response.doctors?.$values || [],
//         tokens: response.tokens?.$values || [],
//         tests: response.tests?.$values || [],
//         medicines: response.medicines?.$values || []
//       })),
//       catchError(error => {
//         console.error('Error loading form data:', error);
//         return of({
//           doctors: [],
//           tokens: [],
//           tests: [],
//           medicines: []
//         });
//       })
//     );
//   }

// }


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CreatePrescriptionDTO, PrescriptionDTO, PrescriptionFormDataDTO, PrescriptionListDTO,MedicineLookupDTO,
  TestLookupDTO,
  DoctorLookupDTO,
  TokenLookupDTO } from '../models/prescription-dto';
import { catchError, map, Observable, of } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class PrescriptionService {
  private apiUrl = `http://localhost:5068/api/Prescriptions`;

  constructor(private http: HttpClient) {}

   getPrescriptions(): Observable<PrescriptionListDTO[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      // Change the type to 'any' initially
      map((response) => response.$values as PrescriptionListDTO[]) // Extract the $values array and cast it
    );
  }


  // getPrescriptions() {
  //   return this.http.get<PrescriptionListDTO[]>(this.apiUrl);
  // }

  getPrescription(id: number) {
    return this.http.get<PrescriptionDTO>(`${this.apiUrl}/${id}`);
  }




  createPrescription(prescription: CreatePrescriptionDTO) {
    return this.http.post<{id: number}>(this.apiUrl, prescription);
  }

  updatePrescription(id: number, prescription: CreatePrescriptionDTO) {
    return this.http.put(`${this.apiUrl}/${id}`, prescription);
  }

  deletePrescription(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

//  getFormData(): Observable<PrescriptionFormDataDTO> {
//   return this.http.get<any>(`${this.apiUrl}/form-data`).pipe(
//     map(response => ({
//       doctors: response.doctors?.$values || [],
//       tokens: response.tokens?.$values || [],
//       tests: response.tests?.$values || [],
//       medicines: response.medicines?.$values || []
//     })),
//     catchError(() => of({
//       doctors: [],
//       tokens: [],
//       tests: [],
//       medicines: []
//     }))
//   );
// }


// getFormData(): Observable<PrescriptionFormDataDTO> {
//   return this.http.get<PrescriptionFormDataDTO>(`${this.apiUrl}/form-data`).pipe(
//     catchError(() => of({
//       doctors: [],
//       tokens: [],
//       tests: [],
//       medicines: []
//     }))
//   );
// }

getFormData(): Observable<PrescriptionFormDataDTO> {
  return this.http.get<any>(`${this.apiUrl}/form-data`).pipe(
    map(response => ({
      doctors: response.doctors?.$values || [],
      tokens: response.tokens?.$values || [],
      tests: response.tests?.$values || [],
      medicines: response.medicines?.$values || []
    })),
    catchError(error => {
      console.error('Error loading form data:', error);
      return of({
        doctors: [],
        tokens: [],
        tests: [],
        medicines: []
      });
    })
  );
}


  generatePrescriptionNo() {
    const date = new Date();
    const prefix = 'PN';
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${year}${month}${day}-${random}`;
  }
}