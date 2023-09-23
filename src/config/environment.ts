import { DotenvConfigOutput, config } from 'dotenv';
import { expand } from 'dotenv-expand';

let env: DotenvConfigOutput = {};

export const getEnvironment = () => {
  if (process.env.NODE_ENV === 'production') env = config();
  else if (!process.env.NODE_ENV) env = config({ path: '.env.development' });
  else env = config({ path: `.env.${process.env.NODE_ENV.toLowerCase()}` });
  expand(env);
};
