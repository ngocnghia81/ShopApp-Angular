import {IsNotEmpty, IsNumber, IsPhoneNumber, IsString} from "class-validator";

export class LoginDTO {
  @IsPhoneNumber()
  phone_number: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsNumber()
  role_id:number;

  constructor(data: any) {
    this.phone_number = data.phone_number;
    this.password = data.password;
    this.role_id = data.selectedRole.id;
  }
}
