import { Express } from 'express';
import supertest from 'supertest';
import App from '../app';

describe('API Server Test - API / Film', () => {
  const app: Express = new App().init();

  test(
    'GET /api/movie',
    async () => {
      await supertest(app)
        .get('/api/movie')
        .set('Content-Type', 'application/json')
        .query({ search: 'avenger' })
        .expect(200);
    },
    App.defaultTimeout,
  );

  test(
    'GET /api/movie2',
    async () => {
      await supertest(app)
        .get('/api/movie2')
        .set('Content-Type', 'application/json')
        .query({ search: 'spongebob' })
        .expect(200);
    },
    App.defaultTimeout,
  );

  test(
    'GET /api/drakorasia',
    async () => {
      await supertest(app)
        .get('/api/drakorasia')
        .set('Content-Type', 'application/json')
        .query({ search: 'tale' })
        .expect(200);
    },
    App.defaultTimeout,
  );
});
