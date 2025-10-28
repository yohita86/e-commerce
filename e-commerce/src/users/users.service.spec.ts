import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: jest.Mocked<UsersRepository>;

  const mockUser = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    name: 'Test User',
    address: 'Test Address',
    phone: 1234567890,
    country: 'Test Country',
    city: 'Test City',
    isAdmin: false,
  };

  beforeEach(async () => {
    const mockUsersRepository = {
      getUserById: jest.fn(),
      getUsers: jest.fn(),
      addUser: jest.fn(),
      updateUser: jest.fn(),
      deleteUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get(UsersRepository);
  });

  describe('getUserById', () => {
    it('should return user when found', async () => {
      // Arrange
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      usersRepository.getUserById.mockResolvedValue(mockUser);

      // Act
      const result = await service.getUserById(userId);

      // Assert
      expect(result).toEqual(mockUser);
      expect(usersRepository.getUserById).toHaveBeenCalledWith(userId);
    });

    it('should throw NotFoundException when user not found', async () => {
      // Arrange
      const userId = 'nonexistent-id';
      usersRepository.getUserById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.getUserById(userId)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.getUserById(userId)).rejects.toThrow(
        'Usuario no encontrado',
      );
    });
  });

  describe('getUsers', () => {
    it('should return paginated users', async () => {
      // Arrange
      const page = 1;
      const limit = 5;
      const mockUsers = [mockUser];
      usersRepository.getUsers.mockResolvedValue(mockUsers);

      // Act
      const result = await service.getUsers(page, limit);

      // Assert
      expect(result).toEqual(mockUsers);
      expect(usersRepository.getUsers).toHaveBeenCalledWith(page, limit);
    });
  });
});
