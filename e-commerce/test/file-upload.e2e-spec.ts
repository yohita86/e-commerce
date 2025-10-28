import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import * as fs from 'fs';
import * as path from 'path';

describe('File Upload (e2e)', () => {
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

  describe('POST /files/uploadImage/:id', () => {
    it('should return 401 when no token provided', () => {
      return request(app.getHttpServer())
        .post('/files/uploadImage/123e4567-e89b-12d3-a456-426614174000')
        .expect(401);
    });

    it('should return 400 when id is not a valid UUID', () => {
      return request(app.getHttpServer())
        .post('/files/uploadImage/invalid-uuid')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);
    });

    it('should return 400 when no file is provided', () => {
      return request(app.getHttpServer())
        .post('/files/uploadImage/123e4567-e89b-12d3-a456-426614174000')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);
    });

    it('should return 400 when file size exceeds limit', () => {
      // Create a large file buffer (simulating a file larger than 200kb)
      const largeBuffer = Buffer.alloc(300000); // 300kb

      return request(app.getHttpServer())
        .post('/files/uploadImage/123e4567-e89b-12d3-a456-426614174000')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('file', largeBuffer, 'large-file.jpg')
        .expect(400);
    });

    it('should return 400 when file type is not allowed', () => {
      const textBuffer = Buffer.from('This is not an image');

      return request(app.getHttpServer())
        .post('/files/uploadImage/123e4567-e89b-12d3-a456-426614174000')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('file', textBuffer, 'document.txt')
        .expect(400);
    });
  });
});
