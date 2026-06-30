import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Income {
  date?: Date;
  type: 'வரவு' | 'அட்வான்ஸ்';
  name: string;
  supplier: string;
  paymentMethod: 'கேஷ்' | 'பாங்க்';
  description?: string;
  referenceNo?: string;
  cashierNo?: string;
  amount: number;
}

@Injectable({
  providedIn: 'root'
})
export class IncomeService {

  private apiUrl = 'http://localhost:5000/api/income';

  constructor(private http: HttpClient) { }


  addIncome(data: Income): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, data);
  }

  getIncomeBySupplier(supplier: string): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/supplier/${encodeURIComponent(supplier)}`
    );
  }

  updateIncome(supplier: string, data: any): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/update/${encodeURIComponent(supplier)}`,
      data
    );
  }


  deleteIncome(supplier: string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/delete/${encodeURIComponent(supplier)}`
    );
  }


  getAllIncome(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all`);
  }

}