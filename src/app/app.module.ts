import { Module } from '@nestjs/common';
import { UsersModule } from '@/users/users.module';
import { AuthModule } from '@/auth/auth.module';
import { AuthGuardService } from '@/auth/auth.guard.service';

@Module({
  providers: [AuthGuardService],
  imports: [AuthModule, UsersModule],
})
export class AppModule {}
