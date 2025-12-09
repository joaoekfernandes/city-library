import { Component } from '@angular/core';
import { CatalogueService } from '../../../services/catalogue.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search.copy',
  imports: [CommonModule, FormsModule],
  templateUrl: './search.copy.html',
  styleUrl: './search.copy.css',
})
export class SearchCopy {
  search = '';
  results: any[] = [];
  copies: any[] = [];

  loading = false;
  error = '';

  constructor(private cat: CatalogueService) {}

  searchDocs() {
    const value = this.search.trim();

    if (!value) {
      this.results = []; // Clear results when input empty
      return;
    }

    this.loading = true;

    this.cat.searchDocuments(value).subscribe({
      next: (data) => {
        this.results = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Search failed';
        this.loading = false;
      },
    });
  }

  select(doc: any) {
    this.loading = true;
    this.copies = [];

    this.cat.getCopyStatus(doc.DocID).subscribe({
      next: (data) => {
        this.copies = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Could not load copy status';
        this.loading = false;
      },
    });
  }
}
