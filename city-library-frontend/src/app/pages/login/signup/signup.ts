import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css'],
})
export class SignUp {
  user = {
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    password: '',
  };

  constructor(private http: HttpClient, private router: Router) {}

  signUp() {
    this.http.post('http://localhost/city-library-backend/api/signup.php', this.user).subscribe({
      next: (res: any) => {
        if (res.success) {
          alert('Signup successful!');
          this.router.navigate(['/login']); // redirect to login page
        } else {
          alert(res.error || 'Signup failed.');
        }
      },
      error: (err) => {
        console.error(err);
        alert(err.error?.error || 'An unexpected error occurred.');
      },
    });
  }
}
