import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { OrdersRepository } from './orders.repository';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('OrdersService', () => {
  let service: OrdersService;
  let ordersRepository: jest.Mocked<OrdersRepository>;

  const mockUser = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    name: 'Test User',
  };

  const mockProduct = {
    id: '456e7890-e89b-12d3-a456-426614174000',
    name: 'Test Product',
    price: 99.99,
    stock: 10,
  };

  const mockOrder = {
    id: '789e0123-e89b-12d3-a456-426614174000',
    date: new Date(),
    user: mockUser,
    orderDetails: {
      id: '012e3456-e89b-12d3-a456-426614174000',
      price: 99.99,
      products: [mockProduct],
    },
  };

  beforeEach(async () => {
    const mockOrdersRepository = {
      addOrder: jest.fn(),
      getOrder: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: OrdersRepository,
          useValue: mockOrdersRepository,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    ordersRepository = module.get(OrdersRepository);
  });

  describe('addOrder', () => {
    it('should create order successfully', async () => {
      // Arrange
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const products = [{ id: '456e7890-e89b-12d3-a456-426614174000' }];
      ordersRepository.addOrder.mockResolvedValue(mockOrder);

      // Act
      const result = await service.addOrder(userId, products);

      // Assert
      expect(result).toEqual(mockOrder);
      expect(ordersRepository.addOrder).toHaveBeenCalledWith(userId, products);
    });

    it('should throw BadRequestException when user not found', async () => {
      // Arrange
      const userId = 'nonexistent-user-id';
      const products = [{ id: '456e7890-e89b-12d3-a456-426614174000' }];
      ordersRepository.addOrder.mockRejectedValue(
        new BadRequestException('Usuario no encontrado'),
      );

      // Act & Assert
      await expect(service.addOrder(userId, products)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getOrder', () => {
    it('should return order when found', async () => {
      // Arrange
      const orderId = '789e0123-e89b-12d3-a456-426614174000';
      ordersRepository.getOrder.mockResolvedValue(mockOrder);

      // Act
      const result = await service.getOrder(orderId);

      // Assert
      expect(result).toEqual(mockOrder);
      expect(ordersRepository.getOrder).toHaveBeenCalledWith(orderId);
    });

    it('should throw NotFoundException when order not found', async () => {
      // Arrange
      const orderId = 'nonexistent-order-id';
      ordersRepository.getOrder.mockResolvedValue(null);

      // Act & Assert
      await expect(service.getOrder(orderId)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.getOrder(orderId)).rejects.toThrow(
        'Orden no encontrada',
      );
    });
  });
});
