import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let jwtService: JwtService;
  let reflector: Reflector;
  let configService: ConfigService;

  beforeEach(() => {
    jwtService = new JwtService();
    reflector = new Reflector();
    configService = new ConfigService();
    authGuard = new AuthGuard(jwtService, reflector, configService);
  });

  it('should be defined', () => {
    expect(authGuard).toBeDefined();
  });

  it('should return true for a public route', () => {
    // Mock ExecutionContext, Reflector, and Request objects
    const mockContext: any = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: 'Bearer token',
          },
        }),
      }),
    };

    const result = authGuard.canActivate(mockContext);
    expect(result).toBe(true);
  });
});
