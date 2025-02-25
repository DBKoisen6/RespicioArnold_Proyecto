import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonalService {
  private apiUrl="https://localhost:7071/api/Personal";

  constructor(private http: HttpClient) { }

  ReadP():Observable<any[]>{
    return this.http.get<any[]>(this.apiUrl);
  }

  CreateP(personal: any): Observable<any>{
    return this.http.post<any>(`${this.apiUrl}`, personal);
  }

  UpdateP(id: number, personal: any): Observable<any>{
    return this.http.put<any>(`${this.apiUrl}/${id}`, personal);
  }

  DeleteP(id: number): Observable<any>{
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
