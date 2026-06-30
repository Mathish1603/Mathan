import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FolderService {

  private apiUrl = 'http://localhost:5000/api/folder';

  constructor(private http: HttpClient) { }

  // POST - Add Folder
  addFolder(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, data);
  }

  // GET
  getFolderByNo(folderNo: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${folderNo}`);
  }

  getFolderByName(folderName: string): Observable<any> {
  return this.http.get(`${this.apiUrl}/name/${folderName}`);
}

  // UPDATE
  updateFolder(folderNo: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${folderNo}`, data);
  }
}