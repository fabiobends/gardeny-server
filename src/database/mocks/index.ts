import { Prisma } from '@prisma/client';
import { UUID, randomUUID } from 'node:crypto';
import { User } from '@/users/entities/user.entity';
import { USER_TEST } from '@/users/mocks/constants';
import { PageRequest } from '../database.types';
import { DatabaseServiceTemplate } from '../templates';
import { DatabaseModule } from '../database.module';
import { DatabaseService } from '../database.service';

export class DatabaseServiceMock implements DatabaseServiceTemplate {
  private users: Array<User> = [];

  async createUser({
    name: userName,
    description: userDescription,
    email,
    hashedPassword,
  }: Prisma.UserCreateInput): Promise<User> {
    let id: string;
    if (this.users.length === 0) {
      id = USER_TEST.id;
    } else {
      id = randomUUID().toString();
    }

    const createdAt = new Date();

    const user: User = {
      ...USER_TEST,
      id,
      createdAt,
      updatedAt: createdAt,
      name: userName ?? USER_TEST.name,
      description: userDescription ?? USER_TEST.description,
      email,
      hashedPassword,
    };
    this.users.push(user);
    return user;
  }

  async updateUser(
    id: UUID,
    { name: userName, hashedPassword: hash }: Prisma.UserUpdateInput,
  ): Promise<User | null> {
    const user = this.users.find((item) => item.id === id);
    const updatedAt = new Date();
    if (user)
      return {
        ...user,
        updatedAt,
        name: userName?.toString() ?? user.name,
        hashedPassword: hash?.toString() ?? user.hashedPassword,
      };
    return null;
  }

  async findAllUsers({}: PageRequest): Promise<User[]> {
    return this.users;
  }

  async findUserById(id: UUID): Promise<User | null> {
    const user = this.users.find((item) => item.id === id);
    if (user) return user;
    return null;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user = this.users.find((item) => item.email === email);
    if (user) return user;
    return null;
  }

  async removeUserById(id: UUID): Promise<User | null> {
    const user = this.users.find((item) => item.id === id);
    if (user) {
      this.users = this.users.filter((item) => item.id !== id);
      return user;
    }
    return null;
  }

  async signUpUser({
    email,
    hashedPassword,
  }: Prisma.UserCreateInput): Promise<User | null> {
    let id = this.users.find((item) => item.id === USER_TEST.id)?.id;
    if (!id) {
      id = USER_TEST.id;
    } else {
      id = randomUUID().toString();
    }

    const createdAt = new Date();

    const user: User = {
      ...USER_TEST,
      id,
      name: null,
      description: null,
      image: null,
      createdAt,
      updatedAt: createdAt,
      email,
      hashedPassword,
    };
    this.users.push(user);
    return user;
  }
}

export const DatabaseProviderMock = {
  provide: DatabaseService,
  useClass: DatabaseServiceMock,
};

export const DatabaseModuleMock = {
  module: DatabaseModule,
  providers: [DatabaseProviderMock],
};
