import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('User Registration', () => {
    it('should register new user', async () => {
      const testPhone = `13800${Math.floor(100000 + Math.random() * 900000)}`;
      
      const res = await request(app.getHttpServer())
        .post('/user/register')
        .send({ phone: testPhone, password: 'Test@123' })
        .expect(201);
      
      expect(res.body).toHaveProperty('phone', testPhone);
      expect(res.body).not.toHaveProperty('password');
    });

    it('should reject duplicate registration', async () => {
      const testPhone = '13800138000';
      
      await request(app.getHttpServer())
        .post('/user/register')
        .send({ phone: testPhone, password: 'Test@123' })
        .expect(409);
    });
  });

  describe('User Login', () => {
    it('should login with valid credentials', async () => {
      const testPhone = '13800138000';
      
      const res = await request(app.getHttpServer())
        .post('/user/login')
        .send({ phone: testPhone, password: 'Test@123' })
        .expect(200);
      
      expect(res.body).toHaveProperty('accessToken');
    });

    it('should reject invalid credentials', async () => {
      await request(app.getHttpServer())
        .post('/user/login')
        .send({ phone: '13800138000', password: 'wrongpassword' })
        .expect(401);
    });
  });

  describe('User Profile', () => {
    let authToken: string;

    beforeAll(async () => {
      // Login to get token
      const res = await request(app.getHttpServer())
        .post('/user/login')
        .send({ phone: '13800138000', password: 'Test@123' });
      authToken = res.body.accessToken;
    });

    it('should get user profile with valid token', async () => {
      const res = await request(app.getHttpServer())
        .get('/user/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('phone', '13800138000');
    });

    it('should reject request without token', async () => {
      await request(app.getHttpServer())
        .get('/user/me')
        .expect(401);
    });
  });
});
