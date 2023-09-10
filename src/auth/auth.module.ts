import { UsersModule } from '@/users/users.module';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';

export const AppJwtModule = JwtModule.register({
  global: true,
  secret: process.env.JWT_SECRET,
});

@Module({
  imports: [UsersModule, AppJwtModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
