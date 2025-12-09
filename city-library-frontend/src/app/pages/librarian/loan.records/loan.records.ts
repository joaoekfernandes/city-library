import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-loan.records',
  imports: [CommonModule, FormsModule],
  templateUrl: './loan.records.html',
  styleUrls: ['./loan.records.css'],
})
export class LoanRecords implements OnInit {
  records: any[] = [];
  filteredRecords: any[] = [];

  searchTerm = '';

  loading = true;
  error = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadRecords();
  }

  loadRecords() {
    this.http
      .get<any[]>('http://localhost/city-library-backend/api/get_borrow_records.php')
      .subscribe({
        next: (data) => {
          const active = data
            .filter((r) => !r.ReturnDate) // Only active loans
            .map((r) => ({
              ...r,
              loanStatus: this.getLoanStatus(r),
            }));

          this.records = active;
          this.filteredRecords = active; // initialize filter
          this.loading = false;
        },
        error: () => {
          this.error = 'Failed to load records.';
          this.loading = false;
        },
      });
  }

  applySearch() {
    const t = this.searchTerm.toLowerCase().trim();

    if (!t) {
      this.filteredRecords = this.records;
      return;
    }

    this.filteredRecords = this.records.filter((r) => {
      return (
        (r.firstName && r.firstName.toLowerCase().includes(t)) ||
        (r.lastName && r.lastName.toLowerCase().includes(t)) ||
        `${r.firstName} ${r.lastName}`.toLowerCase().includes(t) ||
        (r.documentTitle && r.documentTitle.toLowerCase().includes(t)) ||
        (r.publisher && r.publisher.toLowerCase().includes(t)) ||
        (r.userid && r.userid.toString().includes(t)) ||
        (r.borrow_id && r.borrow_id.toString().includes(t)) ||
        (r.CopyNum && r.CopyNum.toString().includes(t))
      );
    });
  }

  getLoanStatus(record: any) {
    const borrow = new Date(record.BorrowDate);
    const due = new Date(borrow);
    due.setDate(due.getDate() + 14);

    if (!record.ReturnDate) return 'Not Returned';

    const returned = new Date(record.ReturnDate);
    return returned <= due ? 'Returned On Time' : 'Returned Late';
  }

  markReturned(r: any) {
    r.loading = true;

    const formData = new FormData();
    formData.append('borrow_id', r.borrow_id);

    this.http
      .post<{ success: boolean; ReturnDate?: string; error?: string }>(
        'http://localhost/city-library-backend/api/mark_return.php',
        formData
      )
      .subscribe({
        next: (res) => {
          r.loading = false;

          if (res.success && res.ReturnDate) {
            r.ReturnDate = res.ReturnDate;
            r.loanStatus = this.getLoanStatus(r);

            if (r.NumBorrowed !== undefined) {
              r.NumBorrowed = Math.max(r.NumBorrowed - 1, 0);
            }

            // Remove from active records
            this.records = this.records.filter((rec) => rec.borrow_id !== r.borrow_id);
            this.applySearch(); // Reapply search after removal
          } else {
            this.error = 'Failed to mark returned: ' + (res.error || 'Unknown error');
          }
        },
        error: () => {
          r.loading = false;
          this.error = 'Server error while marking returned.';
        },
      });
  }
}
