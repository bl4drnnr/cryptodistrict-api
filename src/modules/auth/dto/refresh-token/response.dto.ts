interface IUser {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  twitter: string;
  linkedIn: string;
  personalWebsite: string;
  title: string;
  bio: string;
  publicEmail: boolean;
  createdAt: Date;
}

export class RefreshTokenResponse {
  constructor(_at: string, user: IUser) {
    this._at = _at;
    this.user = user;
  }

  private readonly _at: string;
  private readonly user: IUser;
}
