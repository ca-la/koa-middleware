import * as test from 'tape';
import * as Koa from 'koa';

import * as request from 'supertest';
import bodyParser from '../lib/body-parser';

test('bodyParser with plain text', (t: test.Test) => {
  const app: Koa = new Koa();
  app.use(bodyParser());
  app.use((ctx: Koa.Context): void => {
    ctx.body = ctx.request.body;
  });
  const server = app.listen();

  request(server)
    .post('/')
    .set('Content-Type', 'text/plain')
    .set('Accept', 'text/plain')
    .send('test plain text body')
    .expect(200, 'test plain text body')
    .end((error: Error): void => {
      t.notOk(error);
      server.close();
      t.end();
    });
});

test('bodyParser with json', (t: test.Test) => {
  const app: Koa = new Koa();
  app.use(bodyParser());
  app.use((ctx: Koa.Context): void => {
    ctx.body = ctx.request.body;
  });
  const server = app.listen();

  request(server)
    .post('/')
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .send('{"foo":"bar"}')
    .expect(200, { foo: 'bar' })
    .end((error: Error): void => {
      t.notOk(error);
      server.close();
      t.end();
    });
});

test('bodyParser with application/x-www-form-urlencoded', (t: test.Test) => {
  const app: Koa = new Koa();
  app.use(bodyParser());
  app.use((ctx: Koa.Context): void => {
    ctx.body = ctx.request.body;
  });
  const server = app.listen();

  request(server)
    .post('/')
    .send('foo=bar')
    .expect(200, { foo: 'bar' })
    .end((error: Error): void => {
      t.notOk(error);
      server.close();
      t.end();
    });
});

test('bodyParser with malformed JSON', (t: test.Test) => {
  const app: Koa = new Koa();
  app.use(bodyParser());
  app.use((ctx: Koa.Context): void => {
    ctx.body = ctx.request.body;
  });
  const server = app.listen();

  request(server)
    .post('/')
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .send('{"foo:"bar"}')
    .expect(400, 'Unparsable body')
    .end((error: Error): void => {
      t.notOk(error);
      server.close();
      t.end();
    });
});
