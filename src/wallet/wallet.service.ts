import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { ConfigService } from '@nestjs/config';
import { Wallet } from './interface/wallet.interface';
import { Transfer } from './interface/transfer.interface';
import { Transaction } from './interface/transaction.interface';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class WalletService {
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>('kegow.base_uri');
  }

  private getHeaders(): { [key: string]: string } {
    return {
      Authorization: this.configService.get<string>('kegow.security_key'),
    };
  }

  private buildUrl(
    endpoint: string,
    queryParams?: Record<string, any>,
  ): string {
    const queryString = queryParams ? this.buildQueryString(queryParams) : '';
    return `${this.baseUrl}/${endpoint}${queryString ? `?${queryString}` : ''}`;
  }

  private buildQueryString(params: Record<string, any>): string {
    return Object.keys(params)
      .map(
        (key) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`,
      )
      .join('&');
  }

  private async makeRequest<T>(
    method: 'get' | 'post',
    url: string,
    data?: any,
  ): Promise<AxiosResponse<T>> {
    const headers = this.getHeaders();
    const requestOptions: any = { headers };

    try {
      const response =
        method === 'post'
          ? await this.httpService.axiosRef.post<T>(url, data, requestOptions)
          : await this.httpService.axiosRef.get<T>(url, requestOptions);

      return response;
    } catch (error) {
      // Handle and/or log errors here
      throw new Error(`Request failed: ${error.message}`);
    }
  }

  async create(walletData: Wallet): Promise<AxiosResponse<Wallet>> {
    const url = this.buildUrl('');
    return this.makeRequest<Wallet>('post', url, walletData);
  }

  async findAll(): Promise<AxiosResponse<Wallet[]>> {
    const url = this.buildUrl('');
    return this.makeRequest<Wallet[]>('get', url);
  }

  async findById(walletId: string): Promise<AxiosResponse<Wallet>> {
    try {
      // Construct the URL for retrieving a wallet by ID
      const url = this.buildUrl(walletId);

      // Make a GET request to fetch the wallet data by its ID
      const response = await this.makeRequest<Wallet>('get', url);

      if (response.status === HttpStatus.NOT_FOUND) {
        throw new HttpException(
          `Wallet with ID ${walletId} not found`,
          HttpStatus.NOT_FOUND,
        );
        return;
      }

      return response;
    } catch (error) {
      // Handle other errors or log them for better debugging
      throw new HttpException(
        `Failed to fetch wallet with ID ${walletId}: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async transfer(transferData: Transfer): Promise<AxiosResponse<Wallet>> {
    const url = this.buildUrl('transfers/wallet-to-wallet');
    return this.makeRequest<Wallet>('post', url, transferData);
  }

  async findAllTransaction(
    walletId: string,
    startDate: string,
    endDate: string,
    page = 1,
    limit = 10,
  ): Promise<AxiosResponse<Transaction[]>> {
    const queryParams = { startDate, endDate, page, limit };
    const url = this.buildUrl(`${walletId}/transactions`, queryParams);
    return this.makeRequest<Transaction[]>('get', url);
  }

  async findTransactionByTXN(
    walletId: string,
    transactionRef: string,
  ): Promise<AxiosResponse<Transaction>> {
    const url = this.buildUrl(`${walletId}/transactions/${transactionRef}`);
    return this.makeRequest<Transaction>('get', url);
  }
}
