import { USER_TEST, USER_TEST_PASSWORD } from './mocks/constants';
import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { DatabaseProviderMock } from './mocks';
import { UpdateUserDto } from './dto/update-user.dto';
import { UUID } from 'node:crypto';

describe('UsersService', () => {
  let service: UsersService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, DatabaseProviderMock],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be able to create a user', async () => {
    const spy = jest.spyOn(service, 'create');
    const entries: CreateUserDto = {
      description: USER_TEST.description,
      email: USER_TEST.email,
      name: USER_TEST.name,
      password: USER_TEST_PASSWORD,
    };

    const result = await service.create(entries);

    expect(spy).toHaveBeenCalled();
    expect(result).not.toHaveProperty('password');
    expect(result).toHaveProperty('hashedPassword');
    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('image', null);
    expect(result).toHaveProperty('role', Role.USER);
    expect(result).toHaveProperty('active', true);
    expect(result).toHaveProperty('name', entries.name);
    expect(result).toHaveProperty('description', entries.description);
    expect(result).toHaveProperty('email', entries.email);
    expect(result?.createdAt).toBeInstanceOf(Date);
    expect(result?.updatedAt).toBeInstanceOf(Date);
  });

  it('should be able to get a user', async () => {
    const spy = jest.spyOn(service, 'findOne');

    const result = await service.findOne(USER_TEST.id as UUID);

    expect(spy).toHaveBeenCalled();
    expect(result).not.toBeNull();
  });

  it('should be able to update a user', async () => {
    const findOneSpy = jest.spyOn(service, 'findOne');
    const updateSpy = jest.spyOn(service, 'update');
    const entries: UpdateUserDto = {
      name: 'New Tester',
      password: 'p@ASSWORD123',
    };

    const outdatedUser = await service.findOne(USER_TEST.id as UUID);
    const updatedUser = await service.update(USER_TEST.id as UUID, entries);

    expect(findOneSpy).toHaveBeenCalled();
    expect(updateSpy).toHaveBeenCalled();
    expect(updatedUser.hashedPassword).not.toEqual(
      outdatedUser?.hashedPassword,
    );
    expect(updatedUser.name).not.toEqual(outdatedUser?.name);
    expect(updatedUser.updatedAt.toISOString()).not.toEqual(
      outdatedUser?.updatedAt.toISOString(),
    );
  });

  it('should be able to get all users', async () => {
    const spy = jest.spyOn(service, 'findAll');

    const result = await service.findAll();
    const firstUser = result.find((user) => user.id === USER_TEST.id);

    expect(spy).toHaveBeenCalled();
    expect(result).toBeInstanceOf(Array);
    expect(firstUser).toBeDefined();
  });

  it('should be able to remove a user', async () => {
    const removeSpy = jest.spyOn(service, 'remove');
    const findAllSpy = jest.spyOn(service, 'findAll');

    await service.remove(USER_TEST.id as UUID);
    const result = await service.findAll();

    expect(removeSpy).toHaveBeenCalled();
    expect(findAllSpy).toHaveBeenCalled();
    expect(result).toBeInstanceOf(Array);
    expect(result.length).toEqual(0);
  });
});
