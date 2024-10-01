import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { TokenService } from '../../services/token.service';
import { UserReponse } from '../../responses/UserReponse';
import { UpdateUserDto } from '../../dtos/user/updateUser.dto';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  standalone: true
})
export class UserProfileComponent implements OnInit {
  userReponse?: UserReponse;
  userProfile: FormGroup;
  token?: string;

  constructor(
    private userService: UserService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private tokenService: TokenService,
  ) {
    this.userProfile = this.formBuilder.group(
      {
        fullname: ['', Validators.required],
        date_of_birth: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        address: ['', [Validators.required, Validators.minLength(10)]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        retype_password: ['', [Validators.required, Validators.minLength(8)]],
      },
      {
        validators: [this.passwordMatchValidator, this.dateOfBirthValidator],
      },
    );
  }

  ngOnInit() {
    this.token = this.tokenService.getToken() ?? '';

    if (this.token !== '') {
      this.userService.getUserDetail(this.token).subscribe({
        next: (response: UserReponse) => {
          this.userReponse = {
            ...response,
            data_of_birth: response.data_of_birth ? new Date(response.data_of_birth) : undefined,
          };

          const formattedDate = this.userReponse?.data_of_birth!
            .toISOString()
            .split('T')[0];

          this.userProfile.patchValue({
            fullname: this.userReponse.fullName ?? '',
            date_of_birth: formattedDate,
            address: this.userReponse.address ?? '',
            email: this.userReponse.email ?? '',
          });
        },
        error: (error: any) => {
          console.log(error);
        },
      });
    }
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('retype_password')?.value
      ? null
      : { mismatch: true };
  }

  dateOfBirthValidator(g: FormGroup) {
    const dateOfBirth = g.get('date_of_birth')?.value;

    if (!dateOfBirth) {
      return { date_of_birth: true };
    }

    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    const dayDifference = today.getDate() - birthDate.getDate();

    if (
      age > 16 ||
      (age === 16 && monthDifference > 0) ||
      (age === 16 && monthDifference === 0 && dayDifference >= 0)
    ) {
      return null;
    }

    return { date_of_birth: true };
  }

  update() {
    if (this.userProfile.valid) {
      const updateUserDTO: UpdateUserDto = {
        fullname: this.userProfile.value.fullname,
        date_of_birth: this.userProfile.value.date_of_birth,
        address: this.userProfile.value.address,
        email: this.userProfile.value.email,
        password: this.userProfile.value.password,
      };

      this.userService
        .updateUserDetail(this.userReponse?.id!, this.token!, updateUserDTO)
        .subscribe({
          next: (response: UserReponse) => {
            this.userService.logout();
            this.tokenService.removeToken();
            this.router
              .navigate(['/login'])
              .then(() => window.location.reload());
          },
          error: (error: any) => {
            console.log(error);
          },
        });
    } else {
      if (this.userProfile.hasError('mismatch')) {
        alert('Passwords do not match');
      } else if (this.userProfile.hasError('date_of_birth')) {
        alert('You must be at least 16 years old to register');
      } else {
        alert('Please fill all required fields correctly');
      }
    }
  }
}
