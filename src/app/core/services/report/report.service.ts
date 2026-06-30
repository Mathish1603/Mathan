import { Injectable } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';
import { LeadgerService } from '../leadger/leadger.service';
import { PurchaseService } from '../purchase/purchase.service';
import { ExpenseService } from '../expense/expense.service';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(
    private leadgerService: LeadgerService,
    private purchaseService: PurchaseService,
    private expenseService: ExpenseService
  ) {}

  // ================= MAIN REPORT =================
  getReportBySupplier(supplier: string): Observable<any> {

    return forkJoin({
      leadger: this.leadgerService.getBySupplier(supplier),
      purchase: this.purchaseService.getBySupplier(supplier),
      expense: this.expenseService.getBySupplier(supplier)
    }).pipe(

      map((res: any) => {

        return {
          // ================= LEDGER =================
          leadger: res.leadger?.data || null,

          // ================= PURCHASE (ALL PRODUCTS FIXED) =================
          purchase: this.normalizeArray(res.purchase?.data),

          // ================= EXPENSE =================
          expense: this.normalizeArray(res.expense?.data)
        };
      })

    );
  }

  // ================= SAFE ARRAY HANDLER =================
  private normalizeArray(data: any): any[] {

    if (!data) return [];

    if (Array.isArray(data)) return data;

    return [data];
  }
}