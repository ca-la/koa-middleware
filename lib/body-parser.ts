import * as parse from 'co-body';
import { Middleware } from '../index';
import { Context } from 'koa';

declare module 'koa' {
  interface Request {
    body: any;
  }
}

interface BodyParserOptions {
  errorCode?: number;
  errorMessage?: string;
}

interface FinalOptions extends BodyParserOptions {
  errorCode: number;
  errorMessage: string;
}

const defaultOptions: FinalOptions = {
  errorCode: 400,
  errorMessage: 'Unparsable body'
};

export default function bodyParser(
  options?: BodyParserOptions
): Middleware {
  const finalOptions: FinalOptions = Object.assign(defaultOptions, options);

  return async (
    ctx: Context,
    next: () => Promise<any>
  ): Promise<void> => {
    try {
      ctx.request.body = await parse(ctx.req);
    } catch (er) {
      ctx.throw(finalOptions.errorCode, finalOptions.errorMessage);
    }

    await next();
  };
}
