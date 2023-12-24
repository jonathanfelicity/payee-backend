import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Wallet } from './interface/wallet.interface';
import { AxiosResponse } from 'axios';
import { ConfigService } from '@nestjs/config';
import { Transfer } from './interface/transfer.interface';
import { Transaction } from './interface/transaction.interface';

@Injectable()
export class WalletService {
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl =
      'https://kegow-business-api-soidnv4kmq-ew.a.run.app/api/wallets';
  }

  private getHeaders(): { [key: string]: string } {
    return {
      Authorization: this.configService.get<string>('kegow.security_key'),
    };
  }

  private async makeGetRequest<T>(url: string): Promise<AxiosResponse<T>> {
    const headers = this.getHeaders();
    return this.httpService.axiosRef.get<T>(url, { headers });
  }

  private buildQueryString(params: Record<string, any>): string {
    return Object.keys(params)
      .map(
        (key) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`,
      )
      .join('&');
  }

  private async makePostRequest<T>(
    url: string,
    data: any,
  ): Promise<AxiosResponse<T>> {
    const headers = this.getHeaders();
    return this.httpService.axiosRef.post<T>(url, data, { headers });
  }

  async create(walletdata: Wallet): Promise<AxiosResponse<Wallet>> {
    return this.makePostRequest<Wallet>(this.baseUrl, walletdata);
  }

  async findAll(): Promise<AxiosResponse<Wallet[]>> {
    return this.makeGetRequest<Wallet[]>(this.baseUrl);
  }

  async findById(walletId: string): Promise<AxiosResponse<Wallet>> {
    const url = `${this.baseUrl}/${walletId}`;
    return this.makeGetRequest<Wallet>(url);
  }

  async trnasfer(transferData: Transfer): Promise<AxiosResponse<Wallet>> {
    const url = `${this.baseUrl}/transfers/wallet-to-wallet`;
    return this.makePostRequest<Wallet>(url, transferData);
  }

  async findAllTransaction(
    walletId: string,
    startDate: string,
    endDate: string,
    page = 1,
    limit = 10,
  ): Promise<AxiosResponse<Transaction[]>> {
    const queryParams = {
      startDate,
      endDate,
      page,
      limit,
    };

    const queryString = this.buildQueryString(queryParams);
    const url = `${this.baseUrl}/${walletId}/transactions?${queryString}`;

    return this.makeGetRequest<Transaction[]>(url);
  }

  async findTransactionByTXN(
    walletId: string,
    transactionRef: string,
  ): Promise<AxiosResponse<Transaction>> {
    const url = `${this.baseUrl}/${walletId}/transactions/${transactionRef}`;
    return this.makeGetRequest<Transaction>(url);
  }
}
