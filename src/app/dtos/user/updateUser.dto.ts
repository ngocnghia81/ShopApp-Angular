export class UpdateUserDto {
  fullname?: string;
  phone_number?: string;
  address?: string;
  email?: string;
  date_of_birth?: Date;
  password?: string;

  constructor(
    fullname?: string,
    phoneNumber?: string,
    address?: string,
    email?: string,
    dateOfBirth?: Date,
    password?: string,
  ) {
    this.fullname = fullname;
    this.phone_number = phoneNumber;
    this.address = address;
    this.email = email;
    this.date_of_birth = dateOfBirth;
    this.password = password;
  }
}
