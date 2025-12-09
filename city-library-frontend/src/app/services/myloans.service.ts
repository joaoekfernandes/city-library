import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Loan {
  DocID: number;
  Title: string;
  Author: string;
  Publisher: string;
  BorrowDate: string;
  DueDate: string;
  Overdue: number; // 1 = overdue
}

@Injectable({ providedIn: 'root' })
export class MyLoansService {
  private base = 'http://localhost/city-library-backend/api';

  constructor(private http: HttpClient) {}

  getLoans(userid: string): Observable<Loan[]> {
    return this.http.get<Loan[]>(`${this.base}/my_loans.php?userid=${userid}`);
  }
}
