import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  private apiUrl = 'http://localhost:5000/api/utils';

  constructor(private http: HttpClient) { }

  getDistinct(model: string, field: string, filter?: any): Observable<string[]> {
    let url = `${this.apiUrl}/distinct/${model}/${field}`;
    if (filter) {
      url += `?filter=${encodeURIComponent(JSON.stringify(filter))}`;
    }
    return this.http.get<any>(url)
      .pipe(map(res => res.data || []));
  }
}
