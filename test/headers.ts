import * as test from 'tape';
import * as Koa from 'koa';

import * as request from 'supertest';
import headers from '../lib/headers';

test('headers with default options', (t: test.Test) => {
  const app: Koa = new Koa();
  app.use(headers());
  const server = app.listen();

  request(server)
    .get('/')
    .expect('Access-Control-Allow-Credentials', 'true')
    .expect('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    .expect('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,HEAD,OPTIONS')
    .expect('Access-Control-Allow-Origin', '*')
    .expect('X-Powered-By', '')
    .end((error: Error): void => {
      t.notOk(error);
      server.close();
      t.end();
    });
});

test('headers with custom options', (t: test.Test) => {
  const app: Koa = new Koa();
  const options = {
    cors: {
      credentials: false,
      headers: ['Foo-Bar'],
      methods: ['PUT', 'GET'],
      origin: 'https://ca.la'
    },
    poweredBy: 'Coffee'
  };
  app.use(headers(options));
  const server = app.listen();

  request(server)
    .get('/')
    .expect('Access-Control-Allow-Credentials', 'false')
    .expect('Access-Control-Allow-Headers', 'Foo-Bar')
    .expect('Access-Control-Allow-Methods', 'PUT,GET')
    .expect('Access-Control-Allow-Origin', 'https://ca.la')
    .expect('X-Powered-By', 'Coffee')
    .end((error: Error): void => {
      t.notOk(error);
      server.close();
      t.end();
    });
});

test('headers with a mix of custom and default options', (t: test.Test) => {
  const app: Koa = new Koa();
  const options = {
    cors: {
      credentials: false,
      origin: 'https://ca.la'
    },
    poweredBy: 'Coffee'
  };
  app.use(headers(options));
  const server = app.listen();

  request(server)
    .get('/')
    .expect('Access-Control-Allow-Credentials', 'false')
    .expect('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    .expect('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,HEAD,OPTIONS')
    .expect('Access-Control-Allow-Origin', 'https://ca.la')
    .expect('X-Powered-By', 'Coffee')
    .end((error: Error): void => {
      t.notOk(error);
      server.close();
      t.end();
    });
});
