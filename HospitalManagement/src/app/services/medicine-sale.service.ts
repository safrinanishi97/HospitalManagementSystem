import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';
import { CreateMedicineSaleDTO, MedicineSaleDTO, UpdateMedicineSaleDTO } from '../models/medicine-sale-dto';

@Injectable({
  providedIn: 'root'
})
export class MedicineSaleService {
  private apiUrl = 'http://localhost:5068/api/MedicineSales';  //  Replace with your actual API endpoint

  constructor(private http: HttpClient) {}

  getAll(): Observable<MedicineSaleDTO[]> {
    return this.http.get<any>(this.apiUrl).pipe(
          map((response) => response.$values as MedicineSaleDTO[])
        );
  }

  getById(id: number): Observable<MedicineSaleDTO> {
    return this.http.get<MedicineSaleDTO>(`${this.apiUrl}/${id}`);
  }

  create(medicineSale: CreateMedicineSaleDTO): Observable<MedicineSaleDTO> {
    return this.http.post<MedicineSaleDTO>(this.apiUrl, medicineSale);
  }

  update(id: number, medicineSale: UpdateMedicineSaleDTO): Observable<MedicineSaleDTO> {
    return this.http.put<MedicineSaleDTO>(`${this.apiUrl}/${id}`, medicineSale);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
