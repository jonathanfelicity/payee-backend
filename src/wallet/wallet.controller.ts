import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { WalletService } from './wallet.service';

@Controller('wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}
  @Post()
  async create() {
    return 'HElo';
  }

  @Get()
  async findAll() {
    return (await this.walletService.findAll()).data;
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: string) {
    return (await this.walletService.findById(id)).data;
  }

  async transfer(
    senderWalletNumber: string,
    receiverWalletNumber: string,
    transferAmount: string,
  ) {
    return `${senderWalletNumber} ${receiverWalletNumber} ${transferAmount}`;
  }
}
