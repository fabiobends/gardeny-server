import { AuthModule } from '@/auth/auth.module';
import { UserToken } from '@/auth/entities/user-token.entity';
import { DatabaseService } from '@/database/database.service';
import { PrismaService } from '@/database/prisma.service';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { isJWT } from 'class-validator';
import * as request from 'supertest';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let database: DatabaseService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    const module: TestingModule = await Test.createTestingModule({
      providers: [DatabaseService, PrismaService],
    }).compile();

    app = moduleFixture.createNestApplication();
    database = module.get<DatabaseService>(DatabaseService);
    await app.init();
  });

  afterAll(() => {
    database.reset();
  });

  it('/sign-up (POST)', async () => {
    const user = { email: 'user@example.com', password: 'P@ssword123' };
    const { body } = await request(app.getHttpServer())
      .post('/sign-up')
      .send(user)
      .expect('Content-Type', /json/)
      .expect(HttpStatus.CREATED);

    const data = body as UserToken;
    expect(isJWT(data.token)).toBe(true);
    expect(data.refreshToken).toBeNull();
  });
});
