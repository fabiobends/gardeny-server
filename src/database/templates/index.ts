import { Prisma } from '@prisma/client';
import { UUID } from 'node:crypto';
import { PageRequest } from '../database.types';
import { User } from 'src/users/entities/user.entity';

export abstract class DatabaseServiceTemplate {
  abstract createUser(data: Prisma.UserCreateInput): Promise<User | null>;

  abstract findAllUsers({
    pageSize,
    pageNumber,
  }: PageRequest): Promise<Array<User>>;

  abstract findUserById(id: UUID): Promise<User | null>;

  abstract updateUser(
    id: UUID,
    data: Prisma.UserUpdateInput,
  ): Promise<User | null>;

  abstract removeUserById(id: UUID): Promise<User | null>;
}
