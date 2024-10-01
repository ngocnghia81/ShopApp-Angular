import {Inject, Injectable} from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../environments/enviroment";
import { HttpUtilService } from "./http-util-service.service";
import { RegisterDTO } from "../dtos/user/register.dto";
import { LoginDTO } from "../dtos/user/login.dto";
import { map, Observable, throwError } from "rxjs";
import { LoginResponse } from "../responses/LoginResponse";
import { UserReponse } from "../responses/UserReponse";
import { UpdateUserDto } from "../dtos/user/updateUser.dto";
import { RefreshTokenDto } from "../dtos/user/refreshToken.dto";
import { RegisterResponse } from "../responses/RegisterResponse";
import {CommonModule,DOCUMENT}  from "@angular/common";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private apiRegister: string = `${environment.apiBaseUrl}/users/register`;
  private apiLogin: string = `${environment.apiBaseUrl}/users/login`;
  private apiUserDetail: string = `${environment.apiBaseUrl}/users`;
  private apiRefreshToken: string = `${environment.apiBaseUrl}/users/refresh-token`;
  private localStorage?:Storage;
  private sessionStorage?:Storage;

  constructor(
    private httpClient: HttpClient,
    private httpUltilService: HttpUtilService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.localStorage = document.defaultView?.localStorage;
    this.sessionStorage = document.defaultView?.sessionStorage;
  }

  register(registerDTO: RegisterDTO): Observable<RegisterResponse> | any {
    return this.httpClient.post(this.apiRegister, registerDTO, {
      headers: this.httpUltilService.createHeaders(),
    });
  }

  login(loginDTO: LoginDTO): Observable<LoginResponse> | any {
    return this.httpClient.post(this.apiLogin, loginDTO, {
      headers: this.httpUltilService.createHeaders(),
    });
  }

  getUserDetail(token: string): Observable<UserReponse> | any {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.httpClient.post<UserReponse>(`${this.apiUserDetail}/details`, {}, { headers });
  }

  saveUserReponseToLocalstorage(user: UserReponse) {
    debugger;
    if (user) {
      this.localStorage?.setItem("user", JSON.stringify(user));
    }
  }

  saveUserReponseToSessionstorage(user: UserReponse) {
    debugger;
    if (user) {
      this.sessionStorage?.setItem("user", JSON.stringify(user));
    }
  }

  getUserResponseFromLocalstorage() {
    debugger;
    const user = this.localStorage?.getItem("user");
    if (user) {
      return JSON.parse(user);
    } else {
      return null;
    }
  }

  getUserResponseFromSessionstorage() {
    debugger;
    const user = this.sessionStorage?.getItem("user");
    if (user) {
      return JSON.parse(user);
    } else {
      return null;
    }
  }

  logout() {
    this.localStorage?.removeItem("user");
    this.localStorage?.removeItem("access_token");
    this.localStorage?.removeItem("cart");
    this.localStorage?.removeItem("refresh_token");
    this.sessionStorage?.removeItem("access_token");
    this.sessionStorage?.removeItem("user");
    this.sessionStorage?.removeItem("refresh_token");
  }

  updateUserDetail(
    id: number,
    token: string,
    updateUserDTO: UpdateUserDto,
  ): Observable<UserReponse> | any {
    return this.httpClient.put(`${this.apiUserDetail}/${id}`, updateUserDTO, {
      headers: new HttpHeaders({
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      }),
    });
  }

  public refreshToken(): Observable<LoginResponse> {
    const token = this.localStorage?.getItem("access_token") || this.sessionStorage?.getItem("access_token");
    const refreshToken = this.localStorage?.getItem("refresh_token") || this.sessionStorage?.getItem("refresh_token");

    if (!refreshToken || !token) {
      return throwError(() => new Error("Token or refresh token not found"));
    }

    // Sau khi kiểm tra null, TypeScript sẽ hiểu rằng token và refreshToken chắc chắn là kiểu string.
    const refreshTokenDto: RefreshTokenDto = new RefreshTokenDto(refreshToken);

    return this.httpClient.post<LoginResponse>(
      `${this.apiRefreshToken}`,
      refreshTokenDto,
      {
        headers: new HttpHeaders({
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        }),
      }
    );
  }

}
