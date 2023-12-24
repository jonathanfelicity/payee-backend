import {
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsEnum,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

class BVNDetails {
  @IsString()
  @IsNotEmpty()
  bvn: string;

  @IsString()
  @IsNotEmpty()
  bvnDateOfBirth: string;
}

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  walletReference: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  middleName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ValidateNested()
  @Type(() => BVNDetails)
  bvnDetails: BVNDetails;

  @IsEmail()
  customerEmail: string;

  @IsPhoneNumber(null, {
    message: 'Please provide a valid phone number',
  })
  validatePhoneNumber(value: string): boolean {
    // Custom validation function to check phone number length
    return value.length === 7;
  }

  @IsString()
  @IsNotEmpty()
  photoUrl: string;

  @IsEnum(['male', 'female'])
  gender: 'male' | 'female';
}
