import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface LoginResponse {
  userid: string;
  role: 'member' | 'librarian';
  error?: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.error = '';
    this.loading = true;

    console.log('Trying to login with:', this.email, this.password);

    this.auth.login(this.email, this.password).subscribe({
      next: (res: LoginResponse) => {
        this.loading = false;
        console.log('Login response:', res);

        if (res.error) {
          this.error = res.error;
          return;
        }

        // Store session info
        localStorage.setItem('userid', res.userid);
        localStorage.setItem('role', res.role);

        // Redirect based on role
        if (res.role === 'librarian') {
          this.router.navigate(['/librarian/dashboard']);
        } else {
          this.router.navigate(['/member/dashboard']);
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Network error:', err);
        this.error = 'Network error. Please try again later.';
      },
    });
  }
}
