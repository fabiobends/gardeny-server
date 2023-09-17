import { config } from 'dotenv';

export const getConfig = () => {
  if (process.env.NODE_ENV === 'production') config();
  else if (!process.env.NODE_ENV) config({ path: '.env.development' });
  else config({ path: `.env.${process.env.NODE_ENV.toLowerCase()}` });
};
