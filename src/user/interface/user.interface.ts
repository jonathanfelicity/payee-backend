interface BVNDetailsInterface {
  bvn: string;
  bvnDateOfBirth: string;
}

export interface IUser {
  id: number;
  walletReference: string;
  firstName: string;
  middleName: string;
  lastName: string;
  bvn: BVNDetailsInterface;
  password: string;
  customerEmail: string;
  validatePhoneNumber(value: string): boolean;
  photoUrl: string;
  gender: 'male' | 'female';
}
