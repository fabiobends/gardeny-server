import { UsersModule } from '@/users/users.module';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { EmailModule } from '@/email/email.module';
import { getEnvironment } from '@/config/environment';
import { CodeModule } from '@/code/code.module';

getEnvironment();

export const AppJwtModule = JwtModule.register({
  global: true,
  secret: process.env.JWT_SECRET,
});

@Module({
  imports: [EmailModule, CodeModule, UsersModule, AppJwtModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
