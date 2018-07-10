import { Middleware } from '../index';
import { Context } from 'koa';

interface HeadersOptions {
  poweredBy?: string;
  cors?: {
    origin?: string;
    methods?: string[];
    credentials?: boolean;
    headers?: string[];
  };
}

interface FinalOptions extends HeadersOptions {
  poweredBy: string;
  cors: {
    origin: string;
    methods: string[];
    credentials: boolean;
    headers: string[];
  };
}

const defaultOptions: FinalOptions = {
  cors: {
    credentials: true,
    headers: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
    origin: '*'
  },
  poweredBy: ''
};

export default function headers(
  options?: HeadersOptions
): Middleware {
  const finalOptions: FinalOptions = {
    ...defaultOptions,
    ...options,
    cors: Object.assign(
      {},
      defaultOptions.cors,
      options && options.cors
    )
  };

  return async (
    ctx: Context,
    next: () => Promise<any>
  ): Promise<void> => {
    const { cors } = finalOptions;

    ctx.set({
      'Access-Control-Allow-Credentials': String(cors.credentials),
      'Access-Control-Allow-Headers': cors.headers.join(','),
      'Access-Control-Allow-Methods': cors.methods.join(','),
      'Access-Control-Allow-Origin': cors.origin,
      'X-Powered-By': finalOptions.poweredBy
    });

    await next();
  };
}
