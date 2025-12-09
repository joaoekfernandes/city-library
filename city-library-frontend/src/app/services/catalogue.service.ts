import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Book {
  DocID: number;
  Title: string;
  Author: string;
  Publisher: string;
  NumCopies: number;
  available: number;
  coverURL: string | null;
}

export interface BorrowResponse {
  success?: boolean;
  message?: string;
  error?: string;
  borrowDate?: string;
  dueDate?: string;
  DocID?: number;
  CopyNum?: number;
  BranchID?: number;
}

export interface Loan {
  DocID: number;
  CopyNum: number;
  BranchID: number;
  Title: string;
  Author: string;
  BorrowDate: string;
  DueDate: string;
}

@Injectable({ providedIn: 'root' })
export class CatalogueService {
  private base = 'http://localhost/city-library-backend/api';

  constructor(private http: HttpClient) {}

  getBooks(search: string = ''): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.base}/catalogue.php?search=${encodeURIComponent(search)}`);
  }

  borrowBook(userid: string, docid: number, branchid: number = 1): Observable<BorrowResponse> {
    return this.http.post<BorrowResponse>(`${this.base}/borrow.php`, { userid, docid, branchid });
  }

  getBorrowedBooks(userid: string): Observable<Loan[]> {
    return this.http.get<Loan[]>(`${this.base}/myloans.php?userid=${userid}`);
  }
  searchDocuments(term: string) {
    return this.http.get<any[]>(
      `http://localhost/city-library-backend/api/search_documents.php?term=${term}`
    );
  }

  getCopyStatus(docId: number) {
    return this.http.get<any[]>(
      `http://localhost/city-library-backend/api/get_copy_status.php?docId=${docId}`
    );
  }
}
