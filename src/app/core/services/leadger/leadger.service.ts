import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeadgerService {

  private apiUrl = 'http://localhost:5000/api/leadger';

  constructor(private http: HttpClient) {}

  // CREATE
  saveOrUpdate(data: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/add-account`,
      data
    );
  }

  // GET
  getBySupplier(supplier: string): Observable<any> {

    const encoded = encodeURIComponent(supplier);

    return this.http.get(
      `${this.apiUrl}/supplier/${encoded}`
    );
  }

  // UPDATE
  updateBySupplier(supplier: string, data: any): Observable<any> {

    const encoded = encodeURIComponent(supplier);

    return this.http.put(
      `${this.apiUrl}/supplier/${encoded}`,
      data
    );
  }
}