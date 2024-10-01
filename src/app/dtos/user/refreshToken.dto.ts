export class RefreshTokenDto {
  refreshToken: string; // Đảm bảo tên trường khớp với server

  constructor(refreshToken: string) {
    this.refreshToken = refreshToken;
  }
}
