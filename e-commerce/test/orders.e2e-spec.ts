import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Orders (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let userId: string;

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

    // Create a test user and get auth token
    const signupResponse = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        address: 'Test Address',
        phone: 1234567890,
        country: 'Test Country',
        city: 'Test City',
      });

    userId = signupResponse.body.id;

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        email: 'test@example.com',
        password: 'Password123!',
      });

    authToken = loginResponse.body.token;
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /orders', () => {
    it('should return 401 when no token provided', () => {
      return request(app.getHttpServer())
        .post('/orders')
        .send({
          userId: userId,
          products: [{ id: '123e4567-e89b-12d3-a456-426614174000' }],
        })
        .expect(401);
    });

    it('should return 400 when userId is missing', () => {
      return request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          products: [{ id: '123e4567-e89b-12d3-a456-426614174000' }],
        })
        .expect(400);
    });

    it('should return 400 when products array is empty', () => {
      return request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          userId: userId,
          products: [],
        })
        .expect(400);
    });

    it('should return 400 when userId is not a valid UUID', () => {
      return request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          userId: 'invalid-uuid',
          products: [{ id: '123e4567-e89b-12d3-a456-426614174000' }],
        })
        .expect(400);
    });
  });

  describe('GET /orders/:id', () => {
    it('should return 401 when no token provided', () => {
      return request(app.getHttpServer())
        .get('/orders/123e4567-e89b-12d3-a456-426614174000')
        .expect(401);
    });

    it('should return 400 when id is not a valid UUID', () => {
      return request(app.getHttpServer())
        .get('/orders/invalid-uuid')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);
    });
  });
});
