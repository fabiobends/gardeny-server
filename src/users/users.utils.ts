import * as bcrypt from 'bcrypt';
import { HASH_SALT } from './users.constants';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, HASH_SALT);
}
