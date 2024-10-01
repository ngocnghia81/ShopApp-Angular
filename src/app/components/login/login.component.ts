import {
  Component,
  ContentChild,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import { UserService } from '../../services/user.service';
import { LoginDTO } from '../../dtos/user/login.dto';
import { LoginResponse } from '../../responses/LoginResponse';
import { TokenService } from '../../services/token.service';
import { RoleService } from '../../services/role.service';
import { Role } from '../../models/role';
import { UserReponse } from '../../responses/UserReponse';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
})
export class LoginComponent implements OnInit {
  @ViewChild('loginForm')
  loginForm!: NgForm;
  roles: Role[] = [];
  userResponse?: UserReponse;
  isShowSlash: boolean = true;
  // @ContentChild('password')
  // password: ElementRef;

  constructor(
    private router: Router,
    private userService: UserService,
    private tokenService: TokenService,
    private roleService: RoleService,
    private renderer: Renderer2,
  ) {}

  ngOnInit() {
    this.roleService.getRoles().subscribe(
      {
        next: (response: Role[]) => {
          this.roles = response;
        },
      },
      (error: any) => {
        debugger;
        console.log(error);
      },
    );
  }

  login() {
    if(this.loginForm?.form.valid) {
      const loginDTO: LoginDTO = new LoginDTO(this.loginForm.value);
      this.userService.login(loginDTO).subscribe({
        next: (response: LoginResponse) => {
          debugger;
          this.handleLoginSuccess(response);
        },
        error: (error: any) => {
          console.error(error);
          alert('Error: ' + error.error.message);
        },
      });
    }
  }

  private handleLoginSuccess(response: LoginResponse) {
    const token = response.token;

    if (this.loginForm.form.value.rememberMe) {
      debugger;
      this.tokenService.setToken(token, true);
      console.log(response.refresh_token);
      this.tokenService.setRefreshToken(response.refresh_token, true);
      this.userService.getUserDetail(token).subscribe({
        next: (res: UserReponse) => {
          debugger;
          this.userResponse = {
            ...res,
            data_of_birth: res.data_of_birth ? new Date(res.data_of_birth) : undefined,
          };
          this.userService.saveUserReponseToLocalstorage(this.userResponse);
          this.redirectUser(this.userResponse.role?.name??  '');
        },
        error: (error: any) => {
          console.error(error);
        },
      });
    } else {
      debugger;
      this.tokenService.setToken(token, false);
      this.userService.getUserDetail(token).subscribe({
        next: (res: UserReponse) => {
          this.userResponse = {
            ...res,
            data_of_birth: res.data_of_birth ? new Date(res.data_of_birth) : undefined,
          };
          this.userService.saveUserReponseToSessionstorage(this.userResponse);
          this.tokenService.setRefreshToken(response.refresh_token, false);
          this.redirectUser(this.userResponse?.role.name??'');
        },
        error: (error: any) => {
          console.error(error);
        },
      });
    }
  }

  private redirectUser(role: string) {
    const route = role === 'ADMIN' ? '/admin' : '/home';
    alert('Login successful');
    this.router.navigate([route]).then(() => window.location.reload());
  }

  onEyeClick(passwordFeild: HTMLInputElement, icon: HTMLElement) {
    this.isShowSlash = !this.isShowSlash;
    passwordFeild.type = this.isShowSlash ? 'password' : 'text';

    const iconClass = this.isShowSlash ? 'fa-eye-slash' : 'fa-eye';
    this.renderer.removeClass(icon, 'fa-eye-slash');
    this.renderer.removeClass(icon, 'fa-eye');
    this.renderer.addClass(icon, iconClass);
  }
}
