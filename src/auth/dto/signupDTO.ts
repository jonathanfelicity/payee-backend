import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsPhoneNumber,
  IsUrl,
  IsIn,
  Length,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

class BVNDetails {
  @IsString()
  @Length(11, 11)
  bvn: string;

  @IsString()
  bvnDateOfBirth: string;
}

export class SignUpDTO {
  @IsString()
  @IsOptional()
  walletReference: string;

  @IsString()
  @IsOptional()
  walletName: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  middleName: string;

  @ValidateNested()
  @Type(() => BVNDetails)
  bvnDetails: BVNDetails;

  @IsEmail()
  @IsNotEmpty()
  customerEmail: string;

  @IsPhoneNumber()
  phoneNumber: string;

  @IsUrl()
  @IsOptional()
  photoUrl: string;

  @IsIn(['male', 'female'])
  gender: 'male' | 'female';

  @IsString()
  password: string;
}
