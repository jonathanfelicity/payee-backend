import {
  Injectable,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { WalletService } from 'src/wallet/wallet.service';
import { Wallet } from 'src/wallet/interface/wallet.interface';
import { IUser } from 'src/user/interface/user.interface';

@Injectable()
export class AuthService {
  private readonly INVALID_CREDENTIALS_MESSAGE = 'Invalid credentials';

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly walletService: WalletService,
  ) {}

  async signUp(walletData: Wallet): Promise<any> {
    try {
      walletData.walletReference = '9a37852b-5c7f-4d2-8b12-2d67b77fe64e';
      walletData.walletName = 'CHAMS-WALLET';
      walletData.photoUrl = 'https://example.com/john-doe-avatar.jpg';
      const { password, ...walletDataWithoutPassword } = walletData;
      const wallet: any = await this.walletService.create(
        walletDataWithoutPassword,
      );

      const userData: IUser = {
        walletId: wallet.data.id,
        firstName: walletData.firstName,
        lastName: walletData.lastName,
        email: walletData.customerEmail,
        password: password,
      };
      const user = await this.userService.create(userData);

      return user;
    } catch (error) {
      throw new HttpException(
        'Something went wrong while signing up',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async signIn(email: string, password: string): Promise<any> {
    try {
      const user = await this.userService.findByEmail(email);

      if (!user) {
        throw new UnauthorizedException(this.INVALID_CREDENTIALS_MESSAGE);
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException(this.INVALID_CREDENTIALS_MESSAGE);
      }

      const payload = { sub: user.id }; // Avoid passing the entire user object in the token payload
      return {
        access_token: await this.jwtService.signAsync(payload),
        walletId: user.walletId,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          walletId: user.walletId,
        },
      };
    } catch (error) {
      throw new HttpException(
        'Something went wrong while signing in',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
