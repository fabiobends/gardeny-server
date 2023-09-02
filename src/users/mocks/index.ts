import { DatabaseModule } from '../../database/database.module';
import { DatabaseService } from '../../database/database.service';
import { DatabaseServiceMock } from '../../database/mocks';

export const DatabaseProviderMock = {
  provide: DatabaseService,
  useClass: DatabaseServiceMock,
};

export const DatabaseModuleMock = {
  module: DatabaseModule,
  providers: [DatabaseProviderMock],
};
