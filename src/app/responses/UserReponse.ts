import { Role } from '../models/role';

export class UserReponse {
  id?: number;
  fullName?: string;
  phone_number?: string;
  email?: string;
  address?: string;
  data_of_birth?: Date;
  facebook_account_id?: number;
  google_account_id?: number;
  role: Role;

  constructor(
    id?: number,
    fullName?: string,
    phoneNumber?: string,
    email?: string,
    address?: string,
    dateOfBirth?: Date,
    facebookAccountId?: number,
    googleAccountId?: number,
    role?: Role,
  ) {
    this.id = id;
    this.fullName = fullName;
    this.phone_number = phoneNumber;
    this.address = address;
    this.data_of_birth = dateOfBirth;
    this.facebook_account_id = facebookAccountId;
    this.google_account_id = googleAccountId;
    this.email = email;
    this.role = role??new Role();
  }
}
