import { Component, OnInit } from '@angular/core';
import { Branch, BranchService } from '../../../services/branch.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-branches',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './branches.html',
  styleUrl: './branches.css',
})
export class Branches implements OnInit {
  branches: Branch[] = [];
  selectedBranch: Branch | null = null;

  librarians: any[] = [];
  members: any[] = [];

  newBranchAddress = '';
  error = '';
  loading = true;

  constructor(private branchService: BranchService) {}

  ngOnInit(): void {
    this.loadBranches();
  }

  loadBranches(): void {
    this.loading = true;

    this.branchService.getBranches().subscribe({
      next: (data) => {
        this.branches = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load branches.';
        this.loading = false;
      },
    });
  }

  addBranch(): void {
    if (!this.newBranchAddress.trim()) return;

    this.branchService.addBranch(this.newBranchAddress).subscribe({
      next: () => {
        this.newBranchAddress = '';
        this.loadBranches();
      },
      error: () => (this.error = 'Failed to add branch.'),
    });
  }

  deleteBranch(id: number): void {
    if (!confirm('Delete this branch?')) return;

    this.branchService.deleteBranch(id).subscribe({
      next: () => this.loadBranches(),
      error: () => (this.error = 'Failed to delete branch.'),
    });
  }

  selectBranch(branch: Branch): void {
    this.selectedBranch = branch;

    this.branchService.getBranchDetails(branch.BranchID).subscribe({
      next: (data) => {
        this.librarians = data.librarians;
        this.members = data.members;
      },
      error: () => (this.error = 'Failed to load branch details.'),
    });
  }
}
