import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class SignInDTO {
  @IsEmail({}, { message: 'Please provide a valid email' })
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
