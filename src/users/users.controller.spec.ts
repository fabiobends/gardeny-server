import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModuleMock } from '@/database/mocks';
import { UUID } from 'node:crypto';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersController', () => {
  let controller: UsersController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModuleMock],
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should not accept regular string on the id argument', async () => {
    const removeSpy = jest.spyOn(controller, 'remove');
    const findOneSpy = jest.spyOn(controller, 'findOne');
    const updateSpy = jest.spyOn(controller, 'update');

    await controller.remove('1' as UUID);
    await controller.findOne('1' as UUID);
    await controller.update('1' as UUID, {});

    expect(removeSpy).toHaveBeenCalled();
    expect(findOneSpy).toHaveBeenCalled();
    expect(updateSpy).toHaveBeenCalled();
    expect(removeSpy).toThrow();
    expect(findOneSpy).toThrow();
    expect(updateSpy).toThrow();
  });

  it('should not accept invalid body as argument', async () => {
    const createSpy = jest.spyOn(controller, 'create');
    const updateSpy = jest.spyOn(controller, 'update');
    const invalidBody = { something: 'here' } as unknown as CreateUserDto;

    await controller.update('1' as UUID, invalidBody);
    await controller.create(invalidBody);

    expect(createSpy).toHaveBeenCalled();
    expect(updateSpy).toHaveBeenCalled();
    expect(createSpy).toThrow();
    expect(updateSpy).toThrow();
  });
});
