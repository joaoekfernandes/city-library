import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-historico',
  imports: [CommonModule, FormsModule],
  templateUrl: './historico.html',
  styleUrl: './historico.css',
})
export class Historico implements OnInit {
  records: any[] = [];
  filtered: any[] = [];

  pagedRecords: any[] = [];

  loading = true;
  error = '';

  // search
  searchTerm = '';

  // pagination
  pageSize = 5;
  currentPage = 1;
  totalPages = 1;
  pages: number[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadHistorico();
  }
  normalize(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD') // break accented characters
      .replace(/[\u0300-\u036f]/g, ''); // remove accents
  }

  loadHistorico() {
    this.http
      .get<any[]>('http://localhost/city-library-backend/api/get_borrow_records.php')
      .subscribe({
        next: (data) => {
          this.records = data.map((r) => ({
            ...r,
            loanStatus: r.ReturnDate ? this.getLoanStatus(r) : 'Not Returned',
          }));

          // default filter = all
          this.filtered = [...this.records];

          this.updatePagination();
          this.loading = false;
        },
        error: () => {
          this.error = 'Failed to load records.';
          this.loading = false;
        },
      });
  }

  /** SEARCH + FILTER **/
  applyFilters() {
    const term = this.normalize(this.searchTerm.trim());

    if (!term) {
      this.filtered = [...this.records];
    } else {
      this.filtered = this.records.filter((r) => {
        const name = this.normalize(`${r.firstName} ${r.lastName}`);
        const id = this.normalize(String(r.userid));

        return name.includes(term) || id.includes(term);
      });

      // latest 10 loans
      this.filtered = this.filtered
        .sort((a, b) => new Date(b.BorrowDate).getTime() - new Date(a.BorrowDate).getTime())
        .slice(0, 10);
    }

    this.currentPage = 1;
    this.updatePagination();
  }

  /** PAGINATION **/
  updatePagination() {
    this.totalPages = Math.max(1, Math.ceil(this.filtered.length / this.pageSize));

    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);

    this.updatePage();
  }

  updatePage() {
    const start = (this.currentPage - 1) * this.pageSize;

    this.pagedRecords = this.filtered.slice(start, start + this.pageSize);
  }

  goPage(n: number) {
    if (n < 1 || n > this.totalPages) return;

    this.currentPage = n;
    this.updatePage();
  }

  /** STATUS **/
  getLoanStatus(record: any) {
    const borrow = new Date(record.BorrowDate);
    const due = new Date(borrow);
    due.setDate(due.getDate() + 14);

    const returned = new Date(record.ReturnDate);

    return returned <= due ? 'Returned On Time' : 'Returned Late';
  }
}
