import {Inject, Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable, switchMap, throwError, of } from 'rxjs';
import { TokenService } from '../services/token.service';
import { UserService } from '../services/user.service';
import { LoginResponse } from '../responses/LoginResponse';
import {DOCUMENT} from "@angular/common";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private localStorage?: Storage;

  constructor(
    private tokenService: TokenService,
    private userService: UserService,
    @Inject(DOCUMENT) document: Document
  ) {
    this.localStorage = document.defaultView?.localStorage;
  }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    debugger;
    const token = this.tokenService.getToken();
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !this.isRefreshing) {
          this.isRefreshing = true;
          return this.handle401Error(request, next);
        } else {
          return throwError(() => error);
        }
      }),
    );
  }

  private handle401Error(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    return this.userService.refreshToken().pipe(
      switchMap((response: LoginResponse) => {
        this.isRefreshing = false;

        // Clone the request with the new token and retry it
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${response.token}`,
          },
        });

        if (this.localStorage?.getItem('user')) {
          this.tokenService.setToken(response.token, true);
          this.tokenService.setRefreshToken(response.refresh_token, true);
        } else {
          this.tokenService.setToken(response.token, false);
          this.tokenService.setRefreshToken(response.refresh_token, false);
        }

        // Resend the request with the new token
        return next.handle(request);
      }),
      catchError((error: any) => {
        this.isRefreshing = false;
        this.userService.logout();
        return throwError(() => error);
      }),
    );
  }
}
