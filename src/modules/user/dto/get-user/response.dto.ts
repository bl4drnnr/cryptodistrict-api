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

export class GetUserResponse {
  constructor(user: IUser) {
    this.user = user;
  }

  user: IUser;
}
