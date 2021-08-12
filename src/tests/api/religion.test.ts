import { Express } from 'express';
import supertest from 'supertest';
import App from '../app';

describe('API Server Test - API / Religion', () => {
  const app: Express = new App().init();

  test(
    'GET /api/alkitab',
    async () => {
      await supertest(app)
        .get('/api/alkitab')
        .set('Content-Type', 'application/json')
        .query({ name: 'yohanes', chapter: '1', number: '1-5' })
        .expect(200);
    },
    App.defaultTimeout,
  );
});

describe('API Server Test - API / Religion / Muslim', () => {
  const app: Express = new App().init();

  test(
    'GET /api/muslim/jadwal-sholat',
    async () => {
      await supertest(app)
        .get('/api/muslim/jadwal-sholat')
        .set('Content-Type', 'application/json')
        .expect(200);
    },
    App.defaultTimeout,
  );

  test(
    'GET /api/muslim/jadwal-sholat/:kota',
    () => {
      supertest(app)
        .get('/api/muslim/jadwal-sholat')
        .set('Content-Type', 'application/json')
        .then(async (res: supertest.Response) => {
          const { result } = res.body;
          for (let i = 0; i < result.length; i++) {
            const kota = result[i];
            await supertest(app)
              .get(`/api/muslim/jadwal-sholat/${kota}`)
              .set('Content-Type', 'application/json')
              .expect(200);
          }
        });
    },
    App.defaultTimeout,
  );

  test(
    'GET /api/muslim/random/ayat',
    async () => {
      await supertest(app)
        .get('/api/muslim/random/ayat')
        .set('Content-Type', 'application/json')
        .expect(200);
    },
    App.defaultTimeout,
  );

  test(
    'GET /api/muslim/quran',
    async () => {
      await supertest(app)
        .get('/api/muslim/quran')
        .set('Content-Type', 'application/json')
        .expect(200);
    },
    App.defaultTimeout,
  );

  test(
    'GET /api/muslim/quran/:surat',
    async () => {
      await supertest(app)
        .get('/api/muslim/quran/1')
        .set('Content-Type', 'application/json')
        .expect(200);
    },
    App.defaultTimeout,
  );

  test(
    'GET /api/muslim/quran/:surat/:ayat',
    async () => {
      await supertest(app)
        .get('/api/muslim/quran/1/1')
        .set('Content-Type', 'application/json')
        .expect(200);
    },
    App.defaultTimeout,
  );
});
