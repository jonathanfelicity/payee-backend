import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly INVALID_CREDENTIALS_MESSAGE = 'Invalid credentials';

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(userData): Promise<any> {
    try {
      const user = await this.userService.create(userData);
      // You might want to omit returning sensitive data like the password here
      return user;
    } catch (error) {
      // Handle any specific error if needed or rethrow for global handling
      throw error;
    }
  }

  async signIn(email: string, password: string) {
    try {
      const user = await this.userService.findByEmail(email);

      if (!user) {
        throw new UnauthorizedException(this.INVALID_CREDENTIALS_MESSAGE);
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException(this.INVALID_CREDENTIALS_MESSAGE);
      }

      const payload = { sub: user.id, user: user }; // Avoid passing the entire user object in the token payload
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      // Handle any specific error if needed or rethrow for global handling
      console.log(error);
      throw error;
    }
  }
}
