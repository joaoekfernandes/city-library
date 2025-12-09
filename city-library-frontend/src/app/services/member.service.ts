import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MemberService {
  private base = 'http://localhost/city-library-backend/api';

  constructor(private http: HttpClient) {}

  getCatalogue(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/catalogue.php`);
  }

  getBorrowed(userid: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/borrowed.php?userid=${userid}`);
  }

  borrowDocument(userid: string, document_id: number): Observable<any> {
    return this.http.post(`${this.base}/borrow.php`, { userid, document_id });
  }

  returnDocument(userid: string, document_id: number): Observable<any> {
    return this.http.post(`${this.base}/return.php`, { userid, document_id });
  }

  getProfile(userid: string): Observable<any> {
    return this.http.get<any>(`${this.base}/profile.php?userid=${userid}`);
  }
}
