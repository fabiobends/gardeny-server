import { Inject, Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { UUID } from 'node:crypto';
import { PAGE_SIZE } from './database.constants';
import { PageRequest } from './database.types';
import { PrismaService } from './prisma.service';
import { DatabaseServiceTemplate } from './templates';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class DatabaseService implements DatabaseServiceTemplate {
  @Inject(PrismaService)
  private readonly prisma: PrismaService;

  getSkipAndTakeValues({ pageSize, pageNumber }: PageRequest): {
    skip?: number;
    take?: number;
  } {
    if (!pageNumber) return { skip: undefined, take: undefined };
    const amount = pageSize ?? PAGE_SIZE;
    return { skip: amount * (pageNumber - 1), take: amount };
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async findAllUsers({
    pageSize,
    pageNumber,
  }: PageRequest): Promise<Array<User>> {
    return this.prisma.user.findMany(
      this.getSkipAndTakeValues({ pageSize, pageNumber }),
    );
  }

  async findUserById(id: UUID): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async updateUser(id: UUID, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({
      data,
      where: { id },
    });
  }

  async removeUserById(id: UUID): Promise<User> {
    return this.prisma.user.delete({ where: { id } });
  }
}
