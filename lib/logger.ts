// tslint:disable:no-console

import { Middleware } from '../index';
import { Context } from 'koa';

const COLORS = {
  blue: '\x1b[34m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  reset: '\x1b[0m'
};

interface LoggerOptions {
  colors: {
    error?: string;
    success?: string;
    url?: string;
    reset?: string;
  };
}

interface FinalOptions extends LoggerOptions {
  colors: {
    error: string;
    success: string;
    url: string;
    reset: string;
  };
}

const defaultOptions: FinalOptions = {
  colors: {
    error: COLORS.red,
    reset: COLORS.reset,
    success: COLORS.green,
    url: COLORS.blue
  }
};

export default function logger(
  options?: LoggerOptions
): Middleware {
  const finalOptions: FinalOptions = Object.assign(defaultOptions, options);
  const { colors } = finalOptions;

  return async (
    ctx: Context,
    next: () => Promise<any>
  ): Promise<void> => {
    const start = Date.now();
    try {
      await next();
    } catch (err) {
      console.error('[SERVER-ERROR]', err);
    }

    const ms = Date.now() - start;

    const ip = ctx.request.headers['cf-connecting-ip'] || ctx.request.ip;
    const ua = ctx.request.headers['user-agent'];

    const statusColor = (ctx.status < 400) ? colors.success : colors.error;
    const status = `${statusColor}${ctx.status}${colors.reset}`;
    const url = `${ctx.method} ${colors.url}${ctx.url}${colors.reset}`;
    console.log(`${status} ${url} ms:${ms} ip:${ip} ua:"${ua}"`);
  };
}
