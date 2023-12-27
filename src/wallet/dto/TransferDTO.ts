import { IsString, IsNotEmpty, IsNumberString } from 'class-validator';

export class TransferDTO {
  @IsString()
  @IsNotEmpty()
  senderWalletNumber: string;

  @IsString()
  @IsNotEmpty()
  receiverWalletNumber: string;

  @IsString()
  @IsNotEmpty()
  @IsNumberString()
  transferAmount: string;
}
