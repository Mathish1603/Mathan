import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  private apiUrl = 'http://localhost:5000/api/purchase';

  constructor(private http: HttpClient) { }

  createPurchase(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, data);
  }

  getAllPurchases(): Observable<any> {
    return this.http.get(`${this.apiUrl}`).pipe(
      map((res: any) => res.data || [])
    );
  }

  getSuppliers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/suppliers/list`).pipe(
      map((res: any) => res.data || [])
    );
  }

  getBySupplier(supplier: string): Observable<any> {

  const encoded = encodeURIComponent(supplier);

  return this.http.get(
    `${this.apiUrl}/supplier/${encoded}`
  ).pipe(

    map((res: any) => ({
      success: res.success,
      data: res.data || []
    }))

  );
}

  getByFolderNo(folderNo: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/folder/${folderNo}`).pipe(
      map((res: any) => ({
        success: res.success,
        data: res.data || []
      }))
    );
  }

  getByProduct(product: string): Observable<any> {
    const encoded = encodeURIComponent(product);
    return this.http.get(`${this.apiUrl}/product/${encoded}`);
  }

  updateByProduct(product: string, data: any): Observable<any> {
    const encoded = encodeURIComponent(product); 
    return this.http.put(`${this.apiUrl}/product/${encoded}`, data);
  }

  updateAllByProduct(product: string, data: any): Observable<any> {
    const encoded = encodeURIComponent(product); 
    return this.http.put(`${this.apiUrl}/product/all/${encoded}`, data);
  }
}