import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDTO } from './dto/walletDTO';
import { TransferDTO } from './dto/TransferDTO';

@Controller('wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() wallet: CreateWalletDTO) {
    return (await this.walletService.create(wallet)).data;
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

  @Post('transfer')
  async transfer(@Body() transfer: TransferDTO) {
    return (await this.walletService.transfer(transfer)).data;
  }

  @HttpCode(HttpStatus.OK)
  @Get('transactions/:walletId')
  async findAllTransactions(
    @Request() req,
    @Param('walletId') walletId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    const transactions = await this.walletService.findAllTransaction(
      walletId,
      startDate,
      endDate,
      page,
      limit,
    );
    return transactions.data;
  }

  @HttpCode(HttpStatus.OK)
  @Get('transactions/:walletId/:transactionRef')
  async findTransactionByTXN(
    @Param('walletId') walletId: string,
    @Param('transactionRef') transactionRef: string,
  ) {
    const transaction = await this.walletService.findTransactionByTXN(
      walletId,
      transactionRef,
    );
    return transaction.data;
  }
}
