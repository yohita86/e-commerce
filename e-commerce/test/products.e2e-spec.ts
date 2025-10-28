import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Products (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Configurar ValidationPipe para las pruebas
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: false,
        transform: true,
      }),
    );

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /products', () => {
    it('should return products with default pagination', () => {
      return request(app.getHttpServer())
        .get('/products')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('should return products with custom pagination', () => {
      return request(app.getHttpServer())
        .get('/products?page=1&limit=10')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('GET /products/:id', () => {
    it('should return 400 when id is not a valid UUID', () => {
      return request(app.getHttpServer())
        .get('/products/invalid-uuid')
        .expect(400);
    });

    it('should return 404 when product does not exist', () => {
      return request(app.getHttpServer())
        .get('/products/123e4567-e89b-12d3-a456-426614174000')
        .expect(404);
    });
  });

  describe('POST /products', () => {
    it('should return 201 when product is created successfully', () => {
      return request(app.getHttpServer())
        .post('/products')
        .send({
          name: 'Test Product',
          description: 'Test Description',
          price: 99.99,
          stock: 10,
          imgUrl: 'https://example.com/image.jpg',
        })
        .expect(201);
    });

    it('should return 400 when required fields are missing', () => {
      return request(app.getHttpServer())
        .post('/products')
        .send({
          name: 'Test Product',
          // Missing required fields
        })
        .expect(400);
    });
  });
});
