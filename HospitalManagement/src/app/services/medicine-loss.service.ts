import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';
import { CreateMedicineLossDTO, MedicineLossDTO, UpdateMedicineLossDTO } from '../models/medicine-loss-dto';

@Injectable({
  providedIn: 'root'
})
export class MedicineLossService {
  private apiUrl = 'http://localhost:5068/api/MedicineLosses';  //  Replace with your actual API endpoint

  constructor(private http: HttpClient) {}

  getAll(): Observable<MedicineLossDTO[]> {
    return this.http.get<any>(this.apiUrl).pipe(
          map((response) => response.$values as MedicineLossDTO[])
        );
  }

  getById(id: number): Observable<MedicineLossDTO> {
    return this.http.get<MedicineLossDTO>(`${this.apiUrl}/${id}`);
  }

  create(medicineLoss: CreateMedicineLossDTO): Observable<MedicineLossDTO> {
    return this.http.post<MedicineLossDTO>(this.apiUrl, medicineLoss);
  }

  update(id: number, medicineLoss: UpdateMedicineLossDTO): Observable<MedicineLossDTO> {
    return this.http.put<MedicineLossDTO>(`${this.apiUrl}/${id}`, medicineLoss);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}