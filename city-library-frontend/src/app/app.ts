import { Component, signal } from '@angular/core';
import { Navbar } from './components/navbar/navbar';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, CommonModule, FormsModule, HttpClientModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('city-library');

  // 👈 Add this
  isLoggedIn = false;

  constructor(private router: Router) {
    // update isLoggedIn whenever route changes
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
      this.isLoggedIn = !this.router.url.includes('login');
    });
  }
}
