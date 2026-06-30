import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PurchaseUpdateService {

  private apiUrl = 'http://localhost:5000/api/purchase';

  constructor(private http: HttpClient) {}

  // CREATE
  createPurchase(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  // GET BY ADDAI NO
  getByAddaiNo(addaiNo: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${addaiNo}`);
  }

  // UPDATE
  updatePurchase(addaiNo: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${addaiNo}`, data);
  }

  // DELETE
  deletePurchase(addaiNo: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${addaiNo}`);
  }
}