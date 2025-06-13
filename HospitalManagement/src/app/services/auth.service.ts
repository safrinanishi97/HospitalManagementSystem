// import { Injectable } from '@angular/core';
// import { HttpClient, HttpErrorResponse } from '@angular/common/http';
// import { BehaviorSubject, Observable, throwError } from 'rxjs';
// import { catchError, tap } from 'rxjs/operators';
// import { Router } from '@angular/router';
// import { LoginModel, LoginResponse, RegisterModel } from '../models'; // Adjust import paths
// import { jwtDecode } from 'jwt-decode'; // Install: npm install jwt-decode

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthService {
//   private apiUrl = 'http://localhost:5068/api/Account'; // Use environment
//   private isAuthenticatedSubject = new BehaviorSubject<boolean>(
//     !!localStorage.getItem('token')
//   );
//   public isAuthenticated$ = this.isAuthenticatedSubject.asObservable(); // Use Observable naming convention

//   constructor(private http: HttpClient, private router: Router) {}

//   register(model: RegisterModel): Observable<any> {
//     return this.http.post<any>(`${this.apiUrl}/register`, model).pipe(
//       catchError(this.handleError) // Centralized error handling
//     );
//   }

//   // login(model: LoginModel): Observable<LoginResponse> {
//   //   return this.http.post<LoginResponse>(`${this.apiUrl}/login`, model).pipe(
//   //     tap((response) => {
//   //       if (response && response.token) {
//   //         localStorage.setItem('token', response.token);
//   //         this.isAuthenticatedSubject.next(true);
//   //         console.log('AuthService: Login successful, token stored.');
//   //       } else {
//   //         console.warn('AuthService: Login successful, but no token received.');
//   //         throw new Error('No token received from API'); // Force error
//   //       }
//   //     }),
//   //     catchError(this.handleError)
//   //   );
//   // }

//   login(model: LoginModel): Observable<LoginResponse> {
//     return this.http.post<LoginResponse>(`${this.apiUrl}/login`, model).pipe(
//       tap((response) => {
//         if (response && response.token) {
//           localStorage.setItem('token', response.token);
//           this.isAuthenticatedSubject.next(true);
//           console.log('AuthService: Login successful, token stored.'); // Navigate to the user dashboard after successful login

//           this.router.navigate(['/user']);
//         } else {
//           console.warn('AuthService: Login successful, but no token received.');
//           throw new Error('No token received from API'); // Force error
//         }
//       }),
//       catchError(this.handleError)
//     );
//   }

//   logout(): void {
//     localStorage.removeItem('token');
//     this.isAuthenticatedSubject.next(false);
//     this.router.navigate(['/login']);
//     console.log('AuthService: User logged out.');
//   }

//   getToken(): string | null {
//     return localStorage.getItem('token');
//   }

//   getRole(): string | null {
//     const token = this.getToken();
//     if (token) {
//       try {
//         const decodedToken = jwtDecode(token) as any; // Decode the token
//         const role = decodedToken.role; // Adjust based on your token structure
//         console.log('AuthService: User role:', role);
//         return role;
//       } catch (error) {
//         console.error('AuthService: Error decoding token:', error);
//         return null; // Or throw an error for components to handle
//       }
//     }
//     return null;
//   }

//   isLoggedIn(): boolean {
//     return !!localStorage.getItem('token');
//   }

//   private handleError(error: HttpErrorResponse) {
//     let errorMessage = 'An unknown error occurred!';
//     if (error.error instanceof ErrorEvent) {
//       // Client-side errors
//       errorMessage = `Error: ${error.error.message}`;
//     } else {
//       // Server-side errors
//       errorMessage = `Error Code: ${error.status}\nMessage: ${error.error}`;
//     }
//     console.error(errorMessage);
//     return throwError(() => error); // Propagate the error
//   }
// }
