import { Express } from 'express';
import { Server } from 'http';
import supertest from 'supertest';
import App from './app';

describe('API Server Test - Public', () => {
  let app: Express;
  let server: Server;

  beforeAll(() => {
    app = new App().init();
    server = app.listen(9999);
  });

  test('GET /', async () => {
    await supertest(app)
      .get('/')
      .set('Content-Type', 'application/json')
      .expect(200);
  });

  afterAll(() => server.close());
});
