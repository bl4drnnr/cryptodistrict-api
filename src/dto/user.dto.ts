import { TwoFaType, Users } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto implements Users {
  @ApiProperty()
  id: string;
  @ApiProperty()
  firstName: string;
  @ApiProperty()
  lastName: string;
  @ApiProperty()
  phoneNumber: string;
  @ApiProperty()
  username: string;
  @ApiProperty()
  userNumber: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
  @ApiProperty()
  twitter: string;
  @ApiProperty()
  linkedIn: string;
  @ApiProperty()
  personalWebsite: string;
  @ApiProperty()
  title: string;
  @ApiProperty()
  bio: string;
  @ApiProperty()
  tac: boolean;
  @ApiProperty()
  publicEmail: boolean;
  @ApiProperty()
  accountConfirm: boolean;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  emailChanged: boolean;
  @ApiProperty()
  lastPassChange: Date;
  @ApiProperty()
  twoFaType: TwoFaType;
  @ApiProperty()
  receiveNotifications: boolean;
}
