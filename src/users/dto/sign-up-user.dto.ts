import { IsEmail, IsStrongPassword } from 'class-validator';

export class SignUpUserDto {
  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;
}
