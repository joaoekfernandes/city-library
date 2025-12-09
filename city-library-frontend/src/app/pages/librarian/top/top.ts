import { CommonModule, DecimalPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-top',
  imports: [CommonModule, DecimalPipe, FormsModule],
  templateUrl: './top.html',
  styleUrl: './top.css',
})
export class Top implements OnInit {
  stats: any = {};
  loading = true;
  selectedBranch = 1;
  currentYear = new Date().getFullYear();

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get('http://localhost/city-library-backend/api/get_stats.php').subscribe({
      next: (data: any) => {
        this.stats = data;
        this.selectedBranch = data.branches[0]?.BranchID ?? 1;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }
}
