import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';
import { CreateMedicinePurchaseDTO, MedicinePurchaseDTO, UpdateMedicinePurchaseDTO } from '../models/medicine-purchase-dto';

@Injectable({
  providedIn: 'root'
})
export class MedicinePurchaseService {
  private apiUrl = 'http://localhost:5068/api/MedicinePurchases';  //  Replace with your actual API endpoint

  constructor(private http: HttpClient) {}

  getAll(): Observable<MedicinePurchaseDTO[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((response) => response.$values as MedicinePurchaseDTO[])
    );;
  }

  getById(id: number): Observable<MedicinePurchaseDTO> {
    return this.http.get<MedicinePurchaseDTO>(`${this.apiUrl}/${id}`);
  }

  create(medicinePurchase: CreateMedicinePurchaseDTO): Observable<MedicinePurchaseDTO> {
    return this.http.post<MedicinePurchaseDTO>(this.apiUrl, medicinePurchase);
  }

  update(id: number, medicinePurchase: UpdateMedicinePurchaseDTO): Observable<MedicinePurchaseDTO> {
    return this.http.put<MedicinePurchaseDTO>(`${this.apiUrl}/${id}`, medicinePurchase);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
