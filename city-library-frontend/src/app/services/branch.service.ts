import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Branch {
  BranchID: number;
  Address: string;
}

export interface BranchDetails {
  librarians: any[];
  members: any[];
}

@Injectable({ providedIn: 'root' })
export class BranchService {
  private api = 'http://localhost/city-library-backend/api';

  constructor(private http: HttpClient) {}

  getBranches(): Observable<Branch[]> {
    return this.http.get<Branch[]>(`${this.api}/get_branches.php`);
  }

  addBranch(address: string): Observable<any> {
    return this.http.post(`${this.api}/add_branch.php`, { address });
  }

  deleteBranch(id: number): Observable<any> {
    return this.http.post(`${this.api}/delete_branch.php`, { BranchID: id });
  }

  getBranchDetails(branchId: number): Observable<BranchDetails> {
    return this.http.get<BranchDetails>(`${this.api}/get_branch_details.php?branchId=${branchId}`);
  }
}
