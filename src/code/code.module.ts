import { DatabaseModule } from '@/database/database.module';
import { Module } from '@nestjs/common';
import { CodeService } from './code.service';

@Module({
  imports: [DatabaseModule],
  providers: [CodeService],
  exports: [CodeService],
})
export class CodeModule {}
