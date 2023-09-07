import { Role } from '@prisma/client';

// For tests
export const USER_TEST_PASSWORD = 'P@ssword123';

export const USER_TEST = {
  id: '8e4f97a1-a95b-4381-9757-baae31fdbdca',
  email: 'test@email.com',
  name: 'Tester',
  description: 'Description',
  image: null,
  active: false,
  role: Role.USER,
};
