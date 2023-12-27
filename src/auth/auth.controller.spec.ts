import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignInDTO } from './dto/signinDTO';
import { SignUpDTO } from './dto/signupDTO';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signIn', () => {
    it('should sign in a user with valid credentials', async () => {
      // Mock SignInDTO
      const signInDto: SignInDTO = {
        email: 'test@example.com',
        password: 'password123',
      };

      // Mock AuthService signIn method
      const signedInUser = {
        /* Mock signed-in user data */
      };
      jest.spyOn(authService, 'signIn').mockResolvedValue(signedInUser);

      const result = await controller.signIn(signInDto);

      expect(result).toEqual({ success: true, data: signedInUser });
    });

    it('should handle authentication failure', async () => {
      // Mock SignInDTO
      const signInDto: SignInDTO = {
        email: 'invalid@example.com',
        password: 'invalidpassword',
      };

      // Mock AuthService signIn method to throw an error
      jest.spyOn(authService, 'signIn').mockImplementation(() => {
        throw new Error('Authentication failed');
      });

      const result = await controller.signIn(signInDto);

      expect(result).toEqual({
        success: false,
        message: 'Authentication failed',
      });
    });
  });

  describe('signUp', () => {
    it('should sign up a new user with valid signup data', async () => {
      // Mock SignUpDTO
      const signUpDto: SignUpDTO = {
        firstName: 'John',
        middleName: 'Doe',
        lastName: 'Smith',
        bvnDetails: {
          bvn: '11133333111', // THIS VALUE IS UNIQUE 11 digits
          bvnDateOfBirth: '1990-05-15',
        },
        customerEmail: 'root@example.com', // THIS VALUE IS UNIQUE
        phoneNumber: '+2349121212212', // THIS VALUE IS UNIQUE
        photoUrl: 'https://example.com/john-doe-avatar.jpg', // USE A VALID IMAGE URL
        gender: 'male', // ['male','female']
        password: '1235@root',
        walletReference: '',
        walletName: '',
      };

      // Mock AuthService signUp method
      const createdUser = {
        /* Mock created user data */
      };
      jest.spyOn(authService, 'signUp').mockResolvedValue(createdUser);

      const result = await controller.signUp(signUpDto);

      expect(result).toEqual({ success: true, data: createdUser });
    });

    it('should handle signup failure', async () => {
      // Mock SignUpDTO
      const signUpDto: SignUpDTO = {
        firstName: 'John',
        middleName: 'Doe',
        lastName: 'Smith',
        bvnDetails: {
          bvn: '11133333111', // THIS VALUE IS UNIQUE 11 digits
          bvnDateOfBirth: '1990-05-15',
        },
        customerEmail: 'root@example.com', // THIS VALUE IS UNIQUE
        phoneNumber: '+2349121212212', // THIS VALUE IS UNIQUE
        photoUrl: 'https://example.com/john-doe-avatar.jpg', // USE A VALID IMAGE URL
        gender: 'male', // ['male','female']
        password: '1235@root',
        walletReference: '',
        walletName: '',
      };

      // Mock AuthService signUp method to throw an error
      jest.spyOn(authService, 'signUp').mockImplementation(() => {
        throw new Error('Sign-up failed');
      });

      const result = await controller.signUp(signUpDto);

      expect(result).toEqual({ success: false, message: 'Sign-up failed' });
    });
  });
});
