import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';
import { inject } from '@angular/core';
import { UserService } from '../services/user.service';
import { catchError, map, Observable, of, switchMap } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const tokenService: TokenService = inject(TokenService);
  const userService: UserService = inject(UserService);
  const router: Router = inject(Router);

  const token = tokenService.getToken();
  const isInValidUser = tokenService.getUserId() == 0;
  debugger;
  if (isInValidUser) {
    alert('Invalid user, please login again');
    userService.logout();
    router.navigate(['/login']);
    // window.location.reload();
    return false;
  }

  if (token && tokenService.isExpiredToken()) {
    return handleExpiredToken();
  } else if (!token) {
    router.navigate(['/login']);
    return false;
  }

  return true; // Token is valid, allow access

  function handleExpiredToken(): Observable<boolean> {
    return userService.refreshToken().pipe(
      map((response: any) => {
        debugger;
        tokenService.setToken(response.token, true);
        tokenService.setRefreshToken(response.refresh_token, true);
        return true; // Allow access after token refresh
      }),
      catchError((error: any) => {
        userService.logout();
        router.navigate(['/login']);
        return of(false); // Deny access if refresh fails
      }),
    );
  }
};
