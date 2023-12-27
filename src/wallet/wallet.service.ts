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

  /**
   * Retrieves the headers needed for HTTP requests.
   * @returns Object containing authorization headers.
   */
  private getHeaders(): { [key: string]: string } {
    return {
      Authorization: this.configService.get<string>('kegow.security_key'),
    };
  }

  /**
   * Builds a complete URL from provided path segments.
   * @param paths - Path segments to be joined and encoded in the URL.
   * @returns The constructed URL string.
   */
  private buildUrl(...paths: (string | number)[]): string {
    const joinedPaths = paths
      .map((segment) => encodeURIComponent(segment))
      .join('/');
    return `${this.baseUrl}/${joinedPaths}`;
  }

  /**
   * Makes an HTTP request using Axios based on the specified method.
   * @param method - HTTP method ('get' or 'post').
   * @param url - The URL to make the request.
   * @param data - Optional data to be sent in the request payload for 'post' requests.
   * @returns Promise with the AxiosResponse containing the HTTP response.
   */
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

  /**
   * Creates a new wallet.
   * @param walletData - Data for creating the wallet.
   * @returns Promise with the AxiosResponse containing the created wallet.
   */
  async create(walletData: Wallet): Promise<AxiosResponse<Wallet>> {
    try {
      const url = this.buildUrl('wallets');
      return await this.makeRequest<Wallet>('post', url, walletData);
    } catch (error) {
      throw new HttpException(
        `Failed to create wallet`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Retrieves all wallets.
   * @returns Promise with the AxiosResponse containing an array of wallets.
   */
  async findAll(): Promise<AxiosResponse<Wallet[]>> {
    try {
      const url = this.buildUrl('wallets');
      return await this.makeRequest<Wallet[]>('get', url);
    } catch (error) {
      throw new HttpException(
        `Failed to fetch wallets`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Retrieves a specific wallet by ID.
   * @param walletId - The ID of the wallet to retrieve.
   * @returns Promise with the AxiosResponse containing the retrieved wallet.
   * @throws HttpException if the wallet with the specified ID is not found or an internal server error occurs.
   */
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

  /**
   * Initiates a transfer of funds between wallets.
   * @param transferData - Data required for transferring funds.
   * @returns Promise with the AxiosResponse containing the updated wallet after the transfer.
   * @throws HttpException if the transfer fails or an internal server error occurs.
   */
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

  /**
   * Retrieves transactions for a specific wallet within a specified date range with pagination.
   * @param walletId - The ID of the wallet to retrieve transactions for.
   * @param startDate - Start date for filtering transactions.
   * @param endDate - End date for filtering transactions.
   * @param page - Page number for pagination (default: 1).
   * @param limit - Limit of transactions per page (default: 10).
   * @returns Promise with the AxiosResponse containing an array of transactions.
   * @throws HttpException if fetching transactions fails or an internal server error occurs.
   */
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

  /**
   * Retrieves a specific transaction for a wallet by transaction reference.
   * @param walletId - The ID of the wallet to retrieve the transaction for.
   * @param transactionRef - The reference ID of the transaction.
   * @returns Promise with the AxiosResponse containing details of the specified transaction.
   * @throws HttpException if fetching the transaction fails or an internal server error occurs.
   */
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
