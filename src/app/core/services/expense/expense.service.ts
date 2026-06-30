import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Expense {
  date?: Date;
  type: 'செலவு' | 'பற்று';
  name: string;
  paymentMethod: 'கேஷ்' | 'பாங்க்';
  description?: string;
  referenceNo?: string;
  cashierNo?: string;
  amount: number;
}

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  private apiUrl = 'http://localhost:5000/api/expense';

  constructor(private http: HttpClient) { }

  // POST
  addExpense(data: Expense): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, data);
  }

  // GET
  getBySupplier(supplier: string): Observable<any> {

    const encoded = encodeURIComponent(supplier);

    return this.http.get(
      `${this.apiUrl}/search?supplier=${encoded}`
    );
  }

  // UPDATE
  updateExpense(supplier: string, data: Expense): Observable<any> {

    const encoded = encodeURIComponent(supplier);

    return this.http.put(
      `${this.apiUrl}/update/${encoded}`,
      data
    );
  }

}