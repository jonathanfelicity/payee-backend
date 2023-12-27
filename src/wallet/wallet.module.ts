import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { HttpModule } from '@nestjs/axios';
import { WalletController } from './wallet.controller';

@Module({
  imports: [HttpModule],
  providers: [WalletService],
  controllers: [WalletController],
  exports: [WalletService],
})
export class WalletModule {}
