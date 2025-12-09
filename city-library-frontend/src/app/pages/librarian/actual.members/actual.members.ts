import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-actual.members',
  imports: [CommonModule, FormsModule],
  templateUrl: './actual.members.html',
  styleUrl: './actual.members.css',
})
export class ActualMembers implements OnInit {
  members: any[] = [];
  branches: any[] = [];
  loading = true;
  error = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadBranches();
    this.loadMembers();
  }

  loadBranches() {
    this.http.get<any[]>('http://localhost/city-library-backend/api/get_branches.php').subscribe({
      next: (data) => (this.branches = data),
      error: () => (this.error = 'Failed to load branches'),
    });
  }

  branch1Members: any[] = [];
  branch2Members: any[] = [];

  loadMembers() {
    this.http.get<any[]>('http://localhost/city-library-backend/api/get_members.php').subscribe({
      next: (data) => {
        this.members = data;

        // Split members by BranchID
        this.branch1Members = this.members.filter((m) => m.BranchID == 1);
        this.branch2Members = this.members.filter((m) => m.BranchID == 2);

        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load members.';
        this.loading = false;
      },
    });
  }

  updateBranch(member: any) {
    const body = new FormData();
    body.append('userid', member.userid);
    body.append('branch_id', member.BranchID);

    this.http
      .post('http://localhost/city-library-backend/api/update_member_branch.php', body)
      .subscribe({
        next: () => this.loadMembers(), // refresh tables automatically
        error: () => alert('Failed to update branch'),
      });
  }

  selectedMember: any = null;

  showMemberCard(member: any) {
    this.selectedMember = member;
  }

  closeMemberCard() {
    this.selectedMember = null;
  }
}
