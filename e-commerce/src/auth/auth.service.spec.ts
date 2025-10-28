import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersRepository } from 'src/users/users.repository';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let usersRepository: jest.Mocked<UsersRepository>;
  let jwtService: jest.Mocked<JwtService>;

  const mockUser = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    password: 'hashedPassword123',
    name: 'Test User',
    isAdmin: false,
  };

  beforeEach(async () => {
    const mockUsersRepository = {
      getUserByEmail: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersRepository,
          useValue: mockUsersRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersRepository = module.get(UsersRepository);
    jwtService = module.get(JwtService);
  });

  describe('signIn', () => {
    it('should return token when credentials are valid', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'password123';
      const mockToken = 'jwt-token-123';

      usersRepository.getUserByEmail.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      jwtService.sign.mockReturnValue(mockToken);

      // Act
      const result = await service.signIn(email, password);

      // Assert
      expect(result).toEqual({
        message: 'Usuario logueado',
        token: mockToken,
      });
      expect(usersRepository.getUserByEmail).toHaveBeenCalledWith(email);
      expect(jwtService.sign).toHaveBeenCalledWith({
        id: mockUser.id,
        email: mockUser.email,
        isAdmin: mockUser.isAdmin,
      });
    });

    it('should throw BadRequestException when user does not exist', async () => {
      // Arrange
      const email = 'nonexistent@example.com';
      const password = 'password123';

      usersRepository.getUserByEmail.mockResolvedValue(null);

      // Act & Assert
      await expect(service.signIn(email, password)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.signIn(email, password)).rejects.toThrow(
        'Credenciales incorrectas',
      );
    });

    it('should throw BadRequestException when password is incorrect', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'wrongpassword';

      usersRepository.getUserByEmail.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      // Act & Assert
      await expect(service.signIn(email, password)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.signIn(email, password)).rejects.toThrow(
        'Credenciales incorrectas',
      );
    });
  });
});
