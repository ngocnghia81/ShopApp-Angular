import { UserReponse } from './UserReponse';

export class RegisterResponse {
  message: string;
  user: UserReponse;

  constructor(message: string, user: UserReponse) {
    this.message = message;
    this.user = user;
  }
}
