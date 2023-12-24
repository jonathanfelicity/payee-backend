interface BVNDetailsInterface {
  bvn: string;
  bvnDateOfBirth: string;
}

export interface User {
  walletReference: string;
  firstName: string;
  middleName: string;
  lastName: string;
  bvnDetails: BVNDetailsInterface;
  customerEmail: string;
  validatePhoneNumber(value: string): boolean;
  photoUrl: string;
  gender: 'male' | 'female';
}
