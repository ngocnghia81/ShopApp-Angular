import {Inject, Injectable} from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";
import {DOCUMENT} from "@angular/common";

@Injectable({
  providedIn: "root",
})
export class TokenService {
  private readonly TOKEN_KEY: string = "access_token";  // Không cần phải là null
  private readonly REFRESH_TOKEN_KEY: string = "refresh_token";  // Không cần phải là null
  private jwtHelperService: JwtHelperService = new JwtHelperService();
  private localStorage?: Storage;
  private sessionStorage?: Storage;

  constructor(@Inject(DOCUMENT) document: Document) {
    this.localStorage = document.defaultView?.localStorage;
    this.sessionStorage = document.defaultView?.sessionStorage;
  }

  getToken(): string {
    // Lấy token từ localStorage hoặc sessionStorage
    return (
      this.localStorage?.getItem(this.TOKEN_KEY) ||
      this.sessionStorage?.getItem(this.TOKEN_KEY) ||
      ''
    );
  }

  setToken(token: string, isRememberMe: boolean): void {
    // Lưu token vào localStorage hoặc sessionStorage dựa trên isRememberMe
    if (isRememberMe) {
      this.localStorage?.setItem(this.TOKEN_KEY, token);
    } else {
      this.sessionStorage?.setItem(this.TOKEN_KEY, token);
    }
  }

  getRefreshToken(): string {
    // Lấy refresh token từ localStorage hoặc sessionStorage
    return (
      this.localStorage?.getItem(this.REFRESH_TOKEN_KEY) ||
      this.sessionStorage?.getItem(this.REFRESH_TOKEN_KEY) ||
      ''
    );
  }

  setRefreshToken(token: string, isRememberMe: boolean): void {
    // Lưu refresh token vào localStorage hoặc sessionStorage dựa trên isRememberMe
    if (isRememberMe) {
      this.localStorage?.setItem(this.REFRESH_TOKEN_KEY, token);
    } else {
      this.sessionStorage?.setItem(this.REFRESH_TOKEN_KEY, token);
    }
  }

  removeToken(): void {
    // Xóa cả token và refresh token khỏi localStorage và sessionStorage
    this.localStorage?.removeItem(this.TOKEN_KEY);
    this.sessionStorage?.removeItem(this.TOKEN_KEY);
    this.localStorage?.removeItem(this.REFRESH_TOKEN_KEY);
    this.sessionStorage?.removeItem(this.REFRESH_TOKEN_KEY);
  }

  getUserId(): number {
    const token = this.getToken();
    if (!token) return 0; // Trả về 0 nếu không có token
    const userObj = this.jwtHelperService.decodeToken(token);
    return Number.isInteger(userObj.userId) ? userObj.userId : 0; // Trả về userId nếu nó hợp lệ
  }

  isExpiredToken(): boolean {
    const token = this.getToken();
    return !token || this.jwtHelperService.isTokenExpired(token); // Trả về true nếu token không tồn tại hoặc đã hết hạn
  }
}
