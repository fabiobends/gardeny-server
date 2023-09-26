import { User } from '@/users/entities/user.entity';
import { Code } from './code.entity';

export interface CodeWithUser extends Code {
  user: User;
}
