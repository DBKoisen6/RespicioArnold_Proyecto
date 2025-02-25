import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HijoService {
  private apiUrl='https://localhost:7071/api/Hijo';

  constructor(private http: HttpClient) { }

  readH(idPersonal: number): Observable<any[]>{
    return this.http.get<any[]>(`${this.apiUrl}/personal/${idPersonal}`);
  }

  createH(hijo: any): Observable<any>{
    return this.http.post<any>(`${this.apiUrl}`, hijo);
  }

  updateH(id: number, hijo: any): Observable<any>{
    return this.http.put<any>(`${this.apiUrl}/${id}`, hijo);
  }

  deleteH(id: number): Observable<any>{
    return this.http.delete<any>(`${this.apiUrl}/${id}`)
  }
}
