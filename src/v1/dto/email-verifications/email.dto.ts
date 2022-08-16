import { IsEmail, IsNotEmpty } from 'class-validator';

export class RequestEmailDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
