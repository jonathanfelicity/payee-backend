export interface Wallet {
  walletReference: string;
  walletName: string;
  firstName: string;
  middleName: string;
  lastName: string;
  bvnDetails: {
    bvn: string; // THIS VALUE IS UNIQUE 11 digits
    bvnDateOfBirth: string;
  };
  customerEmail: string;
  phoneNumber: string; // THIS VALUE IS UNIQUE
  photoUrl: string; // USE A VALID IMAGE URL
  gender: 'male' | 'female'; // ['male','female']
}
