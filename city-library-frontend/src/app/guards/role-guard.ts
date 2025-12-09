import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // Get the role stored at login
  const role = localStorage.getItem('role');

  // Not logged in
  if (!role) {
    router.navigate(['/login']);
    return false;
  }

  const url = state.url;

  // Member dashboard only for members
  if (url.startsWith('/member') && role !== 'member') {
    router.navigate(['/login']); // Or redirect to librarian dashboard if you prefer
    return false;
  }

  // Librarian dashboard only for librarians
  if (url.startsWith('/librarian') && role !== 'librarian') {
    router.navigate(['/login']); // Or redirect to member dashboard if you prefer
    return false;
  }

  // Authorized
  return true;
};
