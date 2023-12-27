import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { ConfigService } from '@nestjs/config';
import { Wallet } from './interface/wallet.interface';
import { Transaction } from './interface/transaction.interface';
import { HttpService } from '@nestjs/axios';
import { TransferDTO } from './dto/TransferDTO';

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

  private buildUrl(...paths: (string | number)[]): string {
    const joinedPaths = paths
      .map((segment) => encodeURIComponent(segment))
      .join('/');
    return `${this.baseUrl}/${joinedPaths}`;
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
      throw new Error(`Request failed: ${error.message}`);
    }
  }

  async create(walletData: Wallet): Promise<AxiosResponse<Wallet>> {
    try {
      const url = this.buildUrl('wallets');
      return await this.makeRequest<Wallet>('post', url, walletData);
    } catch (error) {
      // Handle the error appropriately, log it, or throw a custom error
      throw error;
    }
  }

  async findAll(): Promise<AxiosResponse<Wallet[]>> {
    try {
      const url = this.buildUrl('wallets');
      return await this.makeRequest<Wallet[]>('get', url);
    } catch (error) {
      // Handle the error appropriately, log it, or throw a custom error
      throw error; // Re-throw the error or handle it according to your application's needs
    }
  }

  async findById(walletId: string): Promise<AxiosResponse<Wallet>> {
    try {
      const url = this.buildUrl(`wallets`, walletId);
      const response = await this.makeRequest<Wallet>('get', url);

      if (response.status === HttpStatus.NOT_FOUND) {
        throw new HttpException(
          `Wallet with ID ${walletId} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      return response;
    } catch (error) {
      throw new HttpException(
        `Failed to fetch wallet with ID ${walletId}: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async transfer(transferData: TransferDTO): Promise<AxiosResponse<Wallet>> {
    try {
      // Construct URL for transferring funds from one wallet to another
      const url = this.buildUrl('transfers', 'wallet-to-wallet');

      // Make a POST request to initiate the transfer
      const response = await this.makeRequest<Wallet>(
        'post',
        url,
        transferData,
      );

      // Return the response after successful transfer
      return response;
    } catch (error) {
      // Handle errors - log or throw appropriate exceptions

      throw new HttpException(
        `Transfer failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAllTransaction(
    walletId: string,
    startDate: string,
    endDate: string,
    page = 1,
    limit = 10,
  ): Promise<AxiosResponse<Transaction[]>> {
    try {
      // Construct the URL to retrieve transactions for a specific wallet with pagination
      const url = this.buildUrl('wallets', walletId);

      // Make a GET request to fetch transactions based on the given parameters
      const response = await this.makeRequest<Transaction[]>(
        'get',
        url +
          `/transactions?startDate=${startDate}&endDate=${endDate}&page=${page}&limit=${limit}`,
      );

      // Return the response containing transactions
      return response;
    } catch (error) {
      // Handle errors - log or throw appropriate exceptions
      console.error('Failed to fetch transactions:', error.message);

      // If required, throw an HTTP exception or return a custom error response
      throw new HttpException(
        `Failed to fetch transactions for wallet ${walletId}: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findTransactionByTXN(
    walletId: string,
    transactionRef: string,
  ): Promise<AxiosResponse<Transaction>> {
    try {
      // Construct the URL to fetch a specific transaction for a wallet
      const url = this.buildUrl(
        `wallets`,
        walletId,
        'transactions',
        transactionRef,
      );
      // Make a GET request to retrieve the transaction details
      const response = await this.makeRequest<Transaction>('get', url);

      // Return the response containing the transaction details
      return response;
    } catch (error) {
      // If required, throw an HTTP exception or return a custom error response
      throw new HttpException(
        `Failed to fetch transaction ${transactionRef} for wallet ${walletId}: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
