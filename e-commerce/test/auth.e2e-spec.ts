import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Auth (e2e)', () => {
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

  describe('POST /auth/signin', () => {
    it('should return 400 when email is missing', () => {
      return request(app.getHttpServer())
        .post('/auth/signin')
        .send({
          password: 'password123',
        })
        .expect(400);
    });

    it('should return 400 when password is missing', () => {
      return request(app.getHttpServer())
        .post('/auth/signin')
        .send({
          email: 'test@example.com',
        })
        .expect(400);
    });

    it('should return 400 when credentials are invalid', () => {
      return request(app.getHttpServer())
        .post('/auth/signin')
        .send({
          email: 'nonexistent@example.com',
          password: 'wrongpassword',
        })
        .expect(400);
    });
  });

  describe('POST /auth/signup', () => {
    it('should return 400 when required fields are missing', () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          name: 'Test User',
          email: 'test@example.com',
        })
        .expect(400);
    });

    it('should return 400 when email format is invalid', () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          name: 'Test User',
          email: 'invalid-email',
          password: 'Password123!',
          confirmPassword: 'Password123!',
          address: 'Test Address',
          phone: 1234567890,
          country: 'Test Country',
          city: 'Test City',
        })
        .expect(400);
    });
  });
});
