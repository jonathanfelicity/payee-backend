export interface UpdateUserDTO {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  middleName?: string;
  gender?: 'Male' | 'Female';
}
