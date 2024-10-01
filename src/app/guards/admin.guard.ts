import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';
import { inject } from '@angular/core';
import { UserService } from '../services/user.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const tokenService: TokenService = inject(TokenService);
  const router: Router = inject(Router);
  const userService: UserService = inject(UserService);

  debugger;

  // Kiểm tra token hết hạn
  const isExpiredToken = tokenService.isExpiredToken();
  // Kiểm tra User ID hợp lệ
  const isInValidUser = tokenService.getUserId() == 0;
  // Kiểm tra vai trò của người dùng
  const userResponse = userService.getUserResponseFromLocalstorage();
  const isAdmin = userResponse?.role?.name === 'ADMIN';

  if (isExpiredToken || isInValidUser || !isAdmin) {
    if (isExpiredToken) {
      alert('Session expired, please login again');
    } else if (isInValidUser) {
      alert('Invalid user, please login again');
    } else if (!isAdmin) {
      alert('You are not authorized to access this page');
      router.navigate(['/home']);
      return false;
    }
    // Chuyển hướng tới trang đăng nhập
    router.navigate(['/login']);
    return false;
  }

  return true;
};
