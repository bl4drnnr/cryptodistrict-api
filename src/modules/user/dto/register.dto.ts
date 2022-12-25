import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(8)
  password: string;

  @IsString()
  @IsOptional()
  twitter: string;

  @IsString()
  @IsOptional()
  linkedIn: string;

  @IsString()
  @IsOptional()
  personalWebsite: string;

  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  bio: string;
}
