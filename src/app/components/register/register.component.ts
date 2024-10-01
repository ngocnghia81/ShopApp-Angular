import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { RegisterDTO } from '../../dtos/user/register.dto';
import { RegisterResponse } from '../../responses/RegisterResponse';
import { HttpErrorResponse } from '@angular/common/http';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [CommonModule,FormsModule],
})
export class RegisterComponent {
  @ViewChild('registerForm')
  registerForm!: NgForm;

  constructor(
    private userService: UserService,
    private router: Router,
  ) {}

  OnFormSubmitted() {
    const registerDTO: RegisterDTO = new RegisterDTO(this.registerForm.value);
    return this.userService.register(registerDTO).subscribe({
      next: (response: RegisterResponse) => {
        this.router.navigate(['/login']);
      },
      error: (error: HttpErrorResponse) => {
        debugger;
        console.log(error);
        alert(`Cannot register, error: ${error.error.message}`);
      },
      complete: () => {
        debugger;
      },
    });
  }

  checkPasswordsMatch() {
    if (
      this.registerForm.value.password !==
      this.registerForm.value.confirmPassword
    ) {
      this.registerForm.controls['confirmPassword'].setErrors({
        passwordIsNotMatch: true,
      });
    } else {
      this.registerForm.controls['confirmPassword'].setErrors(null);
    }
  }

  checkAge() {
    let today = new Date();
    let birthDate = new Date(this.registerForm.value.dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    let m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age < 18) {
      this.registerForm.controls['dob'].setErrors({ inValidAge: true });
    } else {
      this.registerForm.controls['dob'].setErrors(null);
    }
  }
}
