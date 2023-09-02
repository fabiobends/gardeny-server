import { Test, TestingModule } from '@nestjs/testing';
import { PAGE_SIZE } from './database.constants';
import { DatabaseService } from './database.service';
import { PrismaService } from './prisma.service';

describe('DatabaseService', () => {
  let service: DatabaseService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatabaseService, PrismaService],
    }).compile();

    service = module.get<DatabaseService>(DatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('users', () => {
    it('should have a method to create a user', () => {
      expect(service.createUser).toBeDefined();
    });

    it('should have a method to get a user using an id', () => {
      expect(service.findUserById).toBeDefined();
    });

    it('should have a method to get all users', () => {
      expect(service.findAllUsers).toBeDefined();
    });

    it('should have a method to update a user using an id', () => {
      expect(service.updateUser).toBeDefined();
    });

    it('should have a method to remove a user using an id', () => {
      expect(service.removeUserById).toBeDefined();
    });
  });

  describe('helpers', () => {
    it('should get empty page values when there is no `pageNumber`', () => {
      const func = jest.fn(service.getSkipAndTakeValues);
      func({});
      expect(func).toReturnWith({
        skip: undefined,
        page: undefined,
      });
    });

    it('should get page values when set up', () => {
      const entries = {
        pageNumber: 2,
        pageSize: 40,
      };
      const func = jest.fn(service.getSkipAndTakeValues);
      func(entries);
      expect(func).toReturnWith({ skip: 40, take: entries.pageSize });
    });

    it('should get default `pageSize` value when it is not set up', () => {
      const entries = {
        pageNumber: 1,
      };
      const func = jest.fn(service.getSkipAndTakeValues);
      func(entries);
      expect(func).toReturnWith({ skip: 0, take: PAGE_SIZE });
    });
  });
});
