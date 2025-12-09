import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime } from 'rxjs';
import { CatalogueService, Book } from '../../../services/catalogue.service';

@Component({
  selector: 'app-catalogue',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './catalogue.html',
})
export class CatalogueComponent implements OnInit {
  books: Book[] = [];
  allBooks: Book[] = [];

  searchText = '';

  loading = false;
  error: string | null = null;

  // pagination
  currentPage = 1;
  pageSize = 12;
  totalPages = 1;

  private userId = localStorage.getItem('userid');

  // live-search stream
  private searchChanged = new Subject<string>();

  constructor(private catalogueService: CatalogueService) {}

  ngOnInit(): void {
    // live search with debounce
    this.searchChanged.pipe(debounceTime(300)).subscribe((text) => {
      this.searchText = text;
      this.onSearch();
    });

    // initial
    this.onSearch();
  }

  // used in HTML (input)="onInput($event)"
  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchChanged.next(value);
  }

  onSearch(): void {
    this.loading = true;
    this.error = null;

    this.catalogueService.getBooks(this.searchText).subscribe({
      next: (data) => {
        console.log('API returned:', data);
        this.allBooks = data;
        console.log('RAW', data);
        console.log('First cover:', data[0]?.coverURL);
        this.totalPages = Math.max(1, Math.ceil(this.allBooks.length / this.pageSize));
        this.currentPage = 1;
        this.updatePage();
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to fetch books.';
        this.loading = false;
      },
    });
  }

  updatePage(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    this.books = this.allBooks.slice(start, start + this.pageSize);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;

    this.currentPage = page;
    this.updatePage();
  }

  previousPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  borrowBook(docId: number): void {
    this.error = null;

    if (!this.userId) {
      this.error = 'You must be logged in to borrow a book.';
      return;
    }

    this.catalogueService.borrowBook(this.userId, docId).subscribe({
      next: (res) => {
        if (res.success) {
          alert(res.message);
          this.onSearch();
        } else {
          this.error = res.error ?? null;
        }
      },
      error: (err) => {
        console.error(err);
        this.error = 'Borrow failed.';
      },
    });
  }
}
