import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { WalletModule } from 'src/wallet/wallet.module';
import { Logger } from '@nestjs/common';

@Module({
  imports: [
    WalletModule,
    UserModule,
    JwtModule.register({
      global: true,
      secret: 'topscret', //+ process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    Logger,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
