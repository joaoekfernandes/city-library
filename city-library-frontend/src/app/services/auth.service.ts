import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface LoginResponse {
  userid: string;
  role: 'member' | 'librarian';
}

export interface SignupPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  password: string;
  confirmPassword: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = 'http://localhost/city-library-backend';

  constructor(private http: HttpClient) {}

  // --- Login with email instead of userid ---
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.base}/api/login.php`, { email, password }).pipe(
      tap((res) => {
        // save login state
        localStorage.setItem('userid', res.userid);
        localStorage.setItem('role', res.role);
      })
    );
  }

  signup(payload: SignupPayload): Observable<any> {
    return this.http.post(`${this.base}/api/signup.php`, payload);
  }

  // --- Helper methods for navbar and guards ---

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  getUserId(): string | null {
    return localStorage.getItem('userid');
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('userid') !== null;
  }

  logout() {
    localStorage.clear();
  }
}
