import { Controller, HttpStatus, HttpCode, Body, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDTO } from './dto/signin.dto';
import { SignUpDTO } from './dto/signup.dto';
import { Public } from 'src/shared';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: SignInDTO) {
    try {
      const result = await this.authService.signIn(
        signInDto.email,
        signInDto.password,
      );
      // If authentication is successful, you might return a JWT token or user data
      return { success: true, data: result };
    } catch (error) {
      // Handle authentication failure
      return { success: false, message: 'Authentication failed' };
    }
  }

  @Public()
  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDTO) {
    try {
      const result = await this.authService.signUp(signUpDto); // Pass the necessary sign-up data
      // If sign-up is successful, you might return a success message or created user data
      return { success: true, data: result };
    } catch (error) {
      // Handle sign-up failure
      return { success: false, message: 'Sign-up failed' };
    }
  }
}
