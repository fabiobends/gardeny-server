import { Inject, Injectable } from '@nestjs/common';

import { UUID } from 'node:crypto';
import { DatabaseService } from '../database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { hashPassword } from './users.utils';

@Injectable()
export class UsersService {
  @Inject(DatabaseService)
  private readonly database: DatabaseService;

  async create({
    password,
    description,
    name,
    email,
  }: CreateUserDto): Promise<User> {
    const hashedPassword = await hashPassword(password);
    return this.database.createUser({
      active: true,
      role: 'USER',
      description,
      email,
      hashedPassword,
      name,
    });
  }

  findAll() {
    return this.database.findAllUsers({});
  }

  findOne(id: UUID) {
    return this.database.findUserById(id);
  }

  async update(
    id: UUID,
    { active, description, email, password, image, name, role }: UpdateUserDto,
  ): Promise<User> {
    return this.database.updateUser(id, {
      active,
      description,
      email,
      hashedPassword: password,
      image,
      name,
      role,
    });
  }

  remove(id: UUID) {
    return this.database.removeUserById(id);
  }
}
