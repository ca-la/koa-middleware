import * as test from 'tape';
import * as Koa from 'koa';
import { stub } from 'sinon';

import * as request from 'supertest';
import logger from '../lib/logger';

test('logger with default options', (t: test.Test) => {
  t.plan(2);

  const consoleStub = stub(console, 'log');
  const app: Koa = new Koa();
  app.use(logger());
  const server = app.listen();

  request(server)
    .get('/')
    .expect(404)
    .end((error: Error): void => {
      consoleStub.restore();
      t.ok(consoleStub.calledWithMatch(/node-superagent/));
      t.notOk(error);
      server.close();
    });
});

test('logger when downstream middleware throws an error', (t: test.Test) => {
  t.plan(3);

  const consoleStub = stub(console, 'log');
  const consoleErrorStub = stub(console, 'error');
  const app: Koa = new Koa();
  app.use(logger());
  app.use((): void => {
    throw new Error('Oh no');
  });
  const server = app.listen();

  request(server)
    .get('/')
    .expect(404)
    .end((error: Error): void => {
      consoleErrorStub.restore();
      consoleStub.restore();
      t.ok(consoleErrorStub.calledWithMatch(/SERVER-ERROR/));
      t.ok(consoleStub.calledWithMatch(/node-superagent/));
      t.notOk(error);
      server.close();
    });
});
