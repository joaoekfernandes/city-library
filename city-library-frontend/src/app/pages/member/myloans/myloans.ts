import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CatalogueService, Loan } from '../../../services/catalogue.service';

type LoanWithFine = Loan & {
  returnOn: string;
  predictedFine: number;
};

@Component({
  selector: 'app-my-loans',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './myloans.html',
})
export class MyLoans implements OnInit {
  loans: LoanWithFine[] = [];
  loading = true;
  error: string | null = null;

  private userId = localStorage.getItem('userid');

  constructor(private catalogueService: CatalogueService) {}

  ngOnInit(): void {
    this.loadLoans();
  }

  loadLoans(): void {
    this.loading = true;
    this.error = null;

    if (!this.userId) {
      this.error = 'Could not find user ID. Please log in again.';
      this.loading = false;
      return;
    }

    this.catalogueService.getBorrowedBooks(this.userId).subscribe({
      next: (data: Loan[]) => {
        // Safely convert to LoanWithFine
        this.loans = data.map((loan) => ({
          ...loan,
          returnOn: '',
          predictedFine: 0,
        }));
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to fetch your loans.';
        this.loading = false;
      },
    });
  }

  updateFine(loan: LoanWithFine): void {
    if (!loan.returnOn) {
      loan.predictedFine = 0;
      return;
    }

    const due = new Date(loan.DueDate);
    const returning = new Date(loan.returnOn);

    const msPerDay = 1000 * 60 * 60 * 24;
    const daysLate = Math.floor((returning.getTime() - due.getTime()) / msPerDay);

    loan.predictedFine = daysLate > 0 ? daysLate * 0.25 : 0;
  }
}
