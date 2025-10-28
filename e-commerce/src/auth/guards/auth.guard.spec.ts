import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from './auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ENV } from 'src/config/environment';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let jwtService: jest.Mocked<JwtService>;

  const mockExecutionContext = {
    switchToHttp: () => ({
      getRequest: () => ({
        headers: {},
        user: null,
      }),
    }),
  } as ExecutionContext;

  beforeEach(async () => {
    const mockJwtService = {
      verify: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    guard = module.get<AuthGuard>(AuthGuard);
    jwtService = module.get(JwtService);
  });

  describe('canActivate', () => {
    it('should return true when token is valid', () => {
      // Arrange
      const mockRequest = {
        headers: {
          authorization: 'Bearer valid-token',
        },
        user: null,
      };

      const mockPayload = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'test@example.com',
        isAdmin: false,
        exp: 1234567890,
      };

      const context = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      } as ExecutionContext;

      jwtService.verify.mockReturnValue(mockPayload);

      // Act
      const result = guard.canActivate(context);

      // Assert
      expect(result).toBe(true);
      expect(mockRequest.user).toBeDefined();
      expect(mockRequest.user.id).toBe(mockPayload.id);
      expect(mockRequest.user.email).toBe(mockPayload.email);
    });

    it('should throw UnauthorizedException when no token provided', () => {
      // Arrange
      const mockRequest = {
        headers: {},
        user: null,
      };

      const context = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      } as ExecutionContext;

      // Act & Assert
      expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
      expect(() => guard.canActivate(context)).toThrow(
        'No se ha proporcionado un token de autenticación',
      );
    });

    it('should throw UnauthorizedException when token is invalid', () => {
      // Arrange
      const mockRequest = {
        headers: {
          authorization: 'Bearer invalid-token',
        },
        user: null,
      };

      const context = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      } as ExecutionContext;

      jwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      // Act & Assert
      expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
      expect(() => guard.canActivate(context)).toThrow(
        'Error al validar token de autenticación',
      );
    });
  });
});
