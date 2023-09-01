import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseModule } from '../database/database.module';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

jest.mock('./users.service');

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be able to create a user', async () => {
    const entries: CreateUserDto = {
      description: 'Some description',
      email: 'test@email.com',
      name: 'Tester',
      password: 'P@ssword123',
    };
    const func = jest.fn(service.create);
    await func(entries);
    expect(func).toHaveBeenCalled();
  });
});
