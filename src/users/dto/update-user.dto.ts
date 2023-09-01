import { PartialType } from '@nestjs/mapped-types';
import { $Enums } from '@prisma/client';
import { IsBoolean, IsEnum, IsOptional, IsUrl } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsUrl()
  @IsOptional()
  image?: string;

  @IsBoolean()
  @IsOptional()
  active?: boolean;

  @IsEnum($Enums.Role)
  @IsOptional()
  role?: $Enums.Role;
}
