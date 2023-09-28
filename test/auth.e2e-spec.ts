import { AuthModule } from '@/auth/auth.module';
import { DatabaseService } from '@/database/database.service';
import { PrismaService } from '@/database/prisma.service';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { USER_TEST, USER_TEST_PASSWORD } from '@/users/mocks/constants';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
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
    const user: CreateUserDto = {
      email: USER_TEST.email,
      password: USER_TEST_PASSWORD,
      description: USER_TEST.description,
      name: USER_TEST.name,
    };
    await request(app.getHttpServer())
      .post('/sign-up')
      .send(user)
      .expect('Content-Type', /json/)
      // FIXME: remove this when having running dev and test environments at the same time
      .expect(HttpStatus.CONFLICT);
  });
});
