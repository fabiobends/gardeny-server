import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UUID } from 'node:crypto';
import { PAGE_SIZE } from './database.constants';
import { PageRequest } from './database.types';
import { PrismaService } from './prisma.service';
import { DatabaseServiceTemplate } from './templates';
import { User } from '@/users/entities/user.entity';
import { Code } from '@/code/entities/code.entity';
import { CodeWithUser } from '@/code/entities/code-with-user.entity';

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

  async findUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
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

  async signUpUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async createCode(data: Prisma.CodeCreateInput): Promise<Code> {
    return this.prisma.code.create({ data });
  }

  async findCodeByValue(value: number): Promise<CodeWithUser | null> {
    return this.prisma.code.findUnique({
      where: { value },
      include: { user: true },
    });
  }

  reset(): void {
    this.prisma.user.deleteMany();
    this.prisma.$disconnect();
  }
}
