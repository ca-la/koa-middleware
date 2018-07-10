import bodyParser from './lib/body-parser';
import headers from './lib/headers';
import logger from './lib/logger';
import { Context } from 'koa';

export type Middleware = (ctx: Context, next: () => Promise<any>) => Promise<void>;

export default {
  bodyParser,
  headers,
  logger
};
