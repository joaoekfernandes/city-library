import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { SignUp } from './pages/login/signup/signup';
import { MemberDashboard } from './pages/member/dashboard/dashboard';
import { roleGuard } from './guards/role-guard';
import { LibrarianDashboard } from './pages/librarian/dashboard/dashboard';
// Update the import to match the actual export from './pages/login/login'

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'member/dashboard',
    component: MemberDashboard,
    canActivate: [roleGuard],
  },
  {
    path: 'librarian/dashboard',
    component: LibrarianDashboard,
    canActivate: [roleGuard],
  },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignUp },
  // Role dashboards
  {
    path: 'member/catalogue',
    loadComponent: () =>
      import('./pages/member/catalogue/catalogue').then((m) => m.CatalogueComponent),
  },
  {
    path: 'member/loans',
    loadComponent: () => import('./pages/member/myloans/myloans').then((m) => m.MyLoans),
  },
  {
    path: 'member/profile',
    loadComponent: () => import('./pages/member/profile/profile').then((m) => m.Profile),
  },

  {
    path: 'librarian/loans',
    loadComponent: () =>
      import('./pages/librarian/loan.records/loan.records').then((m) => m.LoanRecords),
  },
  {
    path: 'librarian/members',
    loadComponent: () =>
      import('./pages/librarian/actual.members/actual.members').then((m) => m.ActualMembers),
  },
  {
    path: 'librarian/manage',
    loadComponent: () =>
      import('./pages/librarian/manage.documents/manage.documents').then((m) => m.ManageDocuments),
  },
  {
    path: 'librarian/historico',
    loadComponent: () => import('./pages/librarian/historico/historico').then((m) => m.Historico),
  },
  {
    path: 'librarian/branches',
    loadComponent: () => import('./pages/librarian/branches/branches').then((m) => m.Branches),
  },
  {
    path: 'librarian/search-copy',
    loadComponent: () =>
      import('./pages/librarian/search.copy/search.copy').then((m) => m.SearchCopy),
  },
  {
    path: 'librarian/top',
    loadComponent: () => import('./pages/librarian/top/top').then((m) => m.Top),
  },

  { path: '**', redirectTo: 'login' },
];
