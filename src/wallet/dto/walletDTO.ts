import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsPhoneNumber,
  IsUrl,
  IsIn,
  Length,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class BVNDetails {
  @IsString()
  @Length(11, 11)
  bvn: string;

  @IsString()
  bvnDateOfBirth: string;
}

export class CreateWalletDTO {
  @IsString()
  @IsNotEmpty()
  walletReference: string;

  @IsString()
  @IsNotEmpty()
  walletName: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  middleName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ValidateNested()
  @Type(() => BVNDetails)
  bvnDetails: BVNDetails;

  @IsEmail()
  @IsNotEmpty()
  customerEmail: string;

  @IsPhoneNumber('NG') // Assuming it's Nigerian phone number
  phoneNumber: string;

  @IsUrl()
  @IsNotEmpty()
  photoUrl: string;

  @IsIn(['male', 'female'])
  gender: 'male' | 'female';
}
