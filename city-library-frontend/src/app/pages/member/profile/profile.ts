import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MemberService } from '../../../services/member.service';
import { AuthService } from '../../../services/auth.service';
import { Member, Loan } from '../../../interfaces/member.interface';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
})
export class Profile implements OnInit {
  member: Member | null = null;
  loading = true;
  error = '';

  constructor(
    private memberService: MemberService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userid = localStorage.getItem('userid');
    if (!userid) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadMember(userid);
  }

  loadMember(userid: string) {
    this.loading = true;

    // Use your backend API endpoint to get full member info
    this.memberService.getProfile(userid).subscribe({
      next: (data: any) => {
        this.member = this.normalizeMember(data);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load profile';
        this.loading = false;
      },
    });
  }

  normalizeMember(data: any): Member {
    return {
      userid: data.userid || data.id || '',
      firstname: data.firstName || '',
      lastname: data.lastName || '',
      name: `${data.firstName || ''} ${data.lastName || ''}`.trim(),
      avatar: data.avatar || 'assets/neymar.jpeg',
      joinedDate: data.created_at || data.joinedDate,
      activeLoans: data.active_loans ?? 0,
      totalLoans: data.total_loans ?? 0,
      fines: data.fine ?? 0,
      email: data.email || '',
      phone: data.phone || '',
      bio: data.bio || '',
      recentLoans: (data.recent_loans || []).map((l: any) => ({
        title: l.Title,
        dueDate: l.Dued,
      })),
    };
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
