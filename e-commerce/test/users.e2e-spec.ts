import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Users (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

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
    await request(app.getHttpServer()).post('/auth/signup').send({
      name: 'Test User',
      email: 'test@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      address: 'Test Address',
      phone: 1234567890,
      country: 'Test Country',
      city: 'Test City',
    });

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

  describe('GET /users', () => {
    it('should return 401 when no token provided', () => {
      return request(app.getHttpServer()).get('/users').expect(401);
    });

    it('should return 401 when invalid token provided', () => {
      return request(app.getHttpServer())
        .get('/users')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });

    it('should return 403 when user is not admin', () => {
      return request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(403);
    });
  });

  describe('GET /users/:id', () => {
    it('should return 400 when id is not a valid UUID', () => {
      return request(app.getHttpServer())
        .get('/users/invalid-uuid')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);
    });

    it('should return 401 when no token provided', () => {
      return request(app.getHttpServer())
        .get('/users/123e4567-e89b-12d3-a456-426614174000')
        .expect(401);
    });
  });

  describe('PUT /users/:id', () => {
    it('should return 401 when no token provided', () => {
      return request(app.getHttpServer())
        .put('/users/123e4567-e89b-12d3-a456-426614174000')
        .send({
          name: 'Updated Name',
        })
        .expect(401);
    });

    it('should return 400 when id is not a valid UUID', () => {
      return request(app.getHttpServer())
        .put('/users/invalid-uuid')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Updated Name',
        })
        .expect(400);
    });
  });
});
