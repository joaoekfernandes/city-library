// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { HttpClient } from '@angular/common/http';

// interface Document {
//   DocID: number;
//   Title: string;
//   Publisher: string;
//   Author: string;
//   NumCopies: number;
// }

// interface Copy {
//   DocID: number;
//   CopyNum: number;
//   BranchID: number;
// }

// interface Branch {
//   id: number;
//   name: string;
// }

// @Component({
//   selector: 'app-manage-documents',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './manage.documents.html',
//   styleUrls: ['./manage.documents.css'],
// })
// export class ManageDocuments implements OnInit {
//   documents: Document[] = [];
//   copies: Copy[] = [];
//   branches: Branch[] = []; // Add branch support
//   loading = false;
//   error = '';
//   success = '';

//   // Form fields
//   title = '';
//   publisher = '';
//   numCopies = 1;
//   author = '';
//   isbn = '';
//   branchID: number | null = null;

//   // for the pages
//   currentPage = 1;
//   pageSize = 10;
//   totalPages = 1;
//   paginatedDocs: Document[] = [];

//   constructor(private http: HttpClient) {}

//   ngOnInit(): void {
//     this.loadDocuments();
//     this.loadBranches();
//   }

//   loadDocuments() {
//     this.loading = true;
//     this.error = '';
//     this.http
//       .get<Document[]>('http://localhost/city-library-backend/api/get_documents.php')
//       .subscribe({
//         next: (res) => {
//           this.documents = res;
//           this.loading = false;
//         },
//         error: (err) => {
//           console.error(err);
//           this.error = 'Failed to load documents.';
//           this.loading = false;
//         },
//       });
//   }

//   loadBranches() {
//     this.http
//       .get<Branch[]>('http://localhost/city-library-backend/api/get_branches.php')
//       .subscribe({
//         next: (res) => (this.branches = res),
//         error: (err) => console.error('Failed to load branches', err),
//       });
//   }

//   addDocument() {
//     this.error = '';
//     this.success = '';

//     if (!this.title || !this.publisher || !this.author || this.numCopies < 1 || !this.branchID) {
//       this.error = 'Please fill all required fields.';
//       return;
//     }

//     const payload = {
//       title: this.title,
//       publisher: this.publisher,
//       numCopies: this.numCopies,
//       author: this.author,
//       isbn: this.isbn || null,
//       branchID: this.branchID,
//     };

//     this.http
//       .post<any>('http://localhost/city-library-backend/api/add_document.php', payload)
//       .subscribe({
//         next: (res) => {
//           if (res.success) {
//             this.success = 'Document added successfully!';
//             // Reset form
//             this.title = '';
//             this.publisher = '';
//             this.numCopies = 1;
//             this.author = '';
//             this.isbn = '';
//             this.branchID = null;
//             this.loadDocuments();
//           } else {
//             this.error = res.error || 'Failed to add document.';
//           }
//         },
//         error: (err) => {
//           console.error(err);
//           this.error = 'Server error while adding document.';
//         },
//       });
//   }
// }
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Document {
  DocID: number;
  Title: string;
  Publisher: string;
  Author: string;
  NumCopies: number;
}

interface Copy {
  DocID: number;
  CopyNum: number;
  BranchID: number;
}

interface Branch {
  id: number;
  name: string;
}

@Component({
  selector: 'app-manage-documents',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage.documents.html',
  styleUrls: ['./manage.documents.css'],
})
export class ManageDocuments implements OnInit {
  documents: Document[] = [];
  copies: Copy[] = [];
  branches: Branch[] = [];
  loading = false;
  error = '';
  success = '';

  // Form fields
  title = '';
  publisher = '';
  numCopies = 1;
  author = '';
  isbn = '';
  branchID: number | null = null;

  // Pagination
  currentPage = 1;
  pageSize = 12;
  totalPages = 1;
  paginatedDocs: Document[] = [];

  //searchin
  searchQuery: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadDocuments();
    this.loadBranches();
  }

  filterDocuments() {
    const query = this.searchQuery.toLowerCase().trim();

    if (!query) {
      this.totalPages = Math.ceil(this.documents.length / this.pageSize);
      this.currentPage = 1;
      return this.updatePage();
    }

    const filtered = this.documents.filter(
      (doc) =>
        doc.Title.toLowerCase().includes(query) ||
        doc.Author.toLowerCase().includes(query) ||
        doc.Publisher.toLowerCase().includes(query)
    );

    this.totalPages = Math.ceil(filtered.length / this.pageSize);
    this.currentPage = 1;
    this.paginatedDocs = filtered.slice(0, this.pageSize);
  }

  loadDocuments() {
    this.loading = true;
    this.error = '';
    this.http
      .get<Document[]>('http://localhost/city-library-backend/api/get_documents.php')
      .subscribe({
        next: (docs) => {
          this.documents = docs;
          this.totalPages = Math.ceil(this.documents.length / this.pageSize);
          this.currentPage = 1;
          this.loadCopies();
        },
        error: (err) => {
          console.error(err);
          this.error = 'Failed to load documents.';
          this.loading = false;
        },
      });
  }

  loadCopies() {
    this.http.get<Copy[]>('http://localhost/city-library-backend/api/get_copies.php').subscribe({
      next: (c) => {
        this.copies = c;
        this.updatePage();
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to load copies.';
        this.loading = false;
      },
    });
  }

  loadBranches() {
    this.http
      .get<Branch[]>('http://localhost/city-library-backend/api/get_branches.php')
      .subscribe({
        next: (res) => (this.branches = res),
        error: (err) => console.error('Failed to load branches', err),
      });
  }

  addDocument() {
    this.error = '';
    this.success = '';

    if (!this.title || !this.publisher || !this.author || this.numCopies < 1 || !this.branchID) {
      this.error = 'Please fill all required fields.';
      return;
    }

    const payload = {
      title: this.title,
      publisher: this.publisher,
      numCopies: this.numCopies,
      author: this.author,
      isbn: this.isbn || null,
      branchID: this.branchID,
    };

    this.http
      .post<any>('http://localhost/city-library-backend/api/add_document.php', payload)
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.success = 'Document added successfully!';
            // Reset form
            this.title = '';
            this.publisher = '';
            this.numCopies = 1;
            this.author = '';
            this.isbn = '';
            this.branchID = null;
            this.loadDocuments();
          } else {
            this.error = res.error || 'Failed to add document.';
          }
        },
        error: (err) => {
          console.error(err);
          this.error = 'Server error while adding document.';
        },
      });
  }

  updatePage() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedDocs = this.documents.slice(start, end);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePage();
  }

  previousPage() {
    this.goToPage(this.currentPage - 1);
  }

  nextPage() {
    this.goToPage(this.currentPage + 1);
  }

  getCopyRanges(docID: number): string {
    const docCopies = this.copies
      .filter((c) => c.DocID === docID)
      .sort((a, b) => a.CopyNum - b.CopyNum);

    if (!docCopies.length) return '';

    const ranges: string[] = [];
    let start = docCopies[0];
    let end = docCopies[0];

    for (let i = 1; i < docCopies.length; i++) {
      if (docCopies[i].CopyNum === end.CopyNum + 1 && docCopies[i].BranchID === end.BranchID) {
        end = docCopies[i];
      } else {
        ranges.push(
          start.CopyNum === end.CopyNum
            ? `${start.CopyNum} (B${start.BranchID})`
            : `${start.CopyNum}-${end.CopyNum} (B${start.BranchID})`
        );
        start = end = docCopies[i];
      }
    }
    ranges.push(
      start.CopyNum === end.CopyNum
        ? `${start.CopyNum} (B${start.BranchID})`
        : `${start.CopyNum}-${end.CopyNum} (B${start.BranchID})`
    );

    return ranges.join(', ');
  }

  editDocument(docID: number) {
    alert(`Edit document ${docID}`); // placeholder for future edit functionality
  }
}
