import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UUID } from 'node:crypto';
import { DatabaseService } from '@/database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { SignUpUserDto } from './dto/sign-up-user.dto';

@Injectable()
export class UsersService {
  @Inject(DatabaseService)
  private readonly database: DatabaseService;
  private readonly HASH_SALT = 10;

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.HASH_SALT);
  }

  async create({
    password,
    description,
    name,
    email,
  }: CreateUserDto): Promise<User | null> {
    if (!password) return null;
    const hashedPassword = await this.hashPassword(password);
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

  findOneByEmail(email: string) {
    return this.database.findUserByEmail(email);
  }

  update(
    id: UUID,
    { active, description, email, password, image, name, role }: UpdateUserDto,
  ) {
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

  async signUp({ email, password }: SignUpUserDto) {
    if (!password) return null;
    const hashedPassword = await this.hashPassword(password);
    return this.database.signUpUser({
      active: false,
      role: 'USER',
      email,
      hashedPassword,
    });
  }

  verifyUserByPassword(user: User, password: string) {
    return this.checkPassword(password, user.hashedPassword);
  }

  private async checkPassword(
    password: string,
    hashPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashPassword);
  }
}
