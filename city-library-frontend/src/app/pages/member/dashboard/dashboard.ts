import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MemberService } from '../../../services/member.service';
import { Member, Loan } from '../../../interfaces/member.interface';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-member-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class MemberDashboard implements OnInit {
  member: Member | null = null;
  loading = true;

  constructor(private memberService: MemberService, private auth: AuthService) {}

  ngOnInit() {
    this.startAutoScroll();
    const userid = this.auth.getUserId();
    if (!userid) return;

    this.memberService.getProfile(userid).subscribe({
      next: (data) => {
        this.member = this.normalizeMember(data);
        this.loading = false;
      },
      error: () => {
        console.log('Failed to load member info');
        this.loading = false;
      },
    });
  }

  normalizeMember(data: any): Member {
    return {
      userid: data.userid,
      firstname: data.firstName,
      lastname: data.lastName,
      name: `${data.firstName} ${data.lastName}`,
      avatar: 'assets/default-avatar.png',
      joinedDate: data.joined_date ?? new Date(),
      activeLoans: data.active_loans ?? 0,
      totalLoans: data.total_loans ?? 0,
      fines: data.fines ?? 0,
      email: data.email,
      phone: data.phone,
      bio: '',
      recentLoans: (data.recent_loans || []).map((l: any) => ({
        title: l.Title,
        dueDate: l.ReturnDate || l.BorrowDate,
      })),
    };
  }
  reviews = [
    {
      user: 'Maria A.',
      review: 'An amazing book, I could not stop reading!',
      rating: 5,
      date: 'Dec 2',
      avatar: 'assets/avatars/avatar1.png',
    },
    {
      user: 'Carlos F.',
      review: 'Great story but slow beginning.',
      rating: 4,
      date: 'Nov 30',
      avatar: 'assets/avatars/avatar2.png',
    },
    {
      user: 'Ana P.',
      review: 'A must-read for everyone!',
      rating: 5,
      date: 'Nov 29',
      avatar: 'assets/avatars/avatar3.png',
    },
    {
      user: 'John C.',
      review: 'Good content and well written.',
      rating: 4,
      date: 'Nov 27',
      avatar: 'assets/avatars/avatar4.png',
    },
  ];

  // Auto-scroll logic
  scrollPosition = 0;
  scrollInterval: any;

  startAutoScroll() {
    this.scrollInterval = setInterval(() => {
      this.scrollPosition -= 2; // speed

      const cardWidth = 260; // width + gap
      const totalWidth = this.reviews.length * cardWidth;

      if (Math.abs(this.scrollPosition) >= totalWidth) {
        this.scrollPosition = 0; // reset for seamless infinite scroll
      }
    }, 40); // smooth animation
  }

  pauseScroll() {
    clearInterval(this.scrollInterval);
  }

  resumeScroll() {
    this.startAutoScroll();
  }

  getStars(rating: number) {
    return Array(rating).fill(0);
  }
}
