import { Logger, Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { HttpModule } from '@nestjs/axios';
import { WalletController } from './wallet.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [HttpModule, UserModule],
  providers: [WalletService, Logger],
  controllers: [WalletController],
  exports: [WalletService],
})
export class WalletModule {}
