import {
  IsString,
  IsEmail,
  IsEnum,
  ValidateNested,
  IsNotEmpty,
  Validate,
} from 'class-validator';
import { Type } from 'class-transformer';

import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'isPhoneNumber', async: false })
class IsPhoneNumber implements ValidatorConstraintInterface {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validate(value: any, _args: ValidationArguments) {
    const phoneRegex = /^[0-9+]+$/; // Regular expression to allow only numbers and +
    const isCorrectLength = typeof value === 'string' && value.length === 14;
    return isCorrectLength && phoneRegex.test(value);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage(_args: ValidationArguments) {
    return 'Please provide a valid phone number with a length of 14 characters.';
  }
}

class BVNDetails {
  @IsString()
  @IsNotEmpty()
  bvnNumber: string;

  @IsString()
  @IsNotEmpty()
  bvnDateOfBirth: string;
}

export class SignUpDTO {
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

  @IsString()
  @Validate(IsPhoneNumber)
  phoneNumber: string;

  @IsString()
  password: string;

  @IsEnum(['male', 'female'])
  gender: 'male' | 'female';
}
