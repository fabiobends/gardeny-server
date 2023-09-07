import { DatabaseProviderMock } from '@/database/mocks';
import { UsersModule } from '@/users/users.module';
import { UsersService } from '@/users/users.service';

export const UsersModuleMock = {
  module: UsersModule,
  providers: [UsersService, DatabaseProviderMock],
};
