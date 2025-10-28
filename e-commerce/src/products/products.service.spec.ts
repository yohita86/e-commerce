import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { ProductsRepository } from './products.repository';
import { NotFoundException } from '@nestjs/common';

describe('ProductsService', () => {
  let service: ProductsService;
  let productsRepository: jest.Mocked<ProductsRepository>;

  const mockProduct = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Test Product',
    description: 'Test Description',
    price: 99.99,
    stock: 10,
    imgUrl: 'https://example.com/image.jpg',
  };

  beforeEach(async () => {
    const mockProductsRepository = {
      getProduct: jest.fn(),
      getProducts: jest.fn(),
      addProduct: jest.fn(),
      updateProduct: jest.fn(),
      deleteProduct: jest.fn(),
      addProducts: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: ProductsRepository,
          useValue: mockProductsRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    productsRepository = module.get(ProductsRepository);
  });

  describe('getProduct', () => {
    it('should return product when found', async () => {
      // Arrange
      const productId = '123e4567-e89b-12d3-a456-426614174000';
      productsRepository.getProduct.mockResolvedValue(mockProduct);

      // Act
      const result = await service.getProduct(productId);

      // Assert
      expect(result).toEqual(mockProduct);
      expect(productsRepository.getProduct).toHaveBeenCalledWith(productId);
    });

    it('should throw NotFoundException when product not found', async () => {
      // Arrange
      const productId = 'nonexistent-id';
      productsRepository.getProduct.mockResolvedValue(null);

      // Act & Assert
      await expect(service.getProduct(productId)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.getProduct(productId)).rejects.toThrow(
        'Producto no encontrado',
      );
    });
  });

  describe('getProducts', () => {
    it('should return paginated products', async () => {
      // Arrange
      const page = 1;
      const limit = 5;
      const mockProducts = [mockProduct];
      productsRepository.getProducts.mockResolvedValue(mockProducts);

      // Act
      const result = await service.getProducts(page, limit);

      // Assert
      expect(result).toEqual(mockProducts);
      expect(productsRepository.getProducts).toHaveBeenCalledWith(page, limit);
    });
  });
});
