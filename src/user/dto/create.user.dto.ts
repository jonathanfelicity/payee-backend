export class CreateUserDTO {
  firstName: string;

  lastName: string;

  email: string;

  phone: string;

  middleName?: string;

  gender: 'Male' | 'Female';
}
