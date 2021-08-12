import { Express } from 'express';
import supertest from 'supertest';
import App from '../app';

describe('API Server Test - API / Forecast', () => {
  const app: Express = new App().init();

  test(
    'GET /api/info-gempa',
    async () => {
      await supertest(app)
        .get('/api/info-gempa')
        .set('Content-Type', 'application/json')
        .expect(200);
    },
    App.defaultTimeout,
  );

  test(
    'GET /api/cuaca',
    async () => {
      await supertest(app)
        .get('/api/cuaca')
        .set('Content-Type', 'application/json')
        .query({ kabupaten: 'kab bungo' })
        .expect(200);
    },
    App.defaultTimeout,
  );

  test(
    'GET /api/arti-nama',
    async () => {
      await supertest(app)
        .get('/api/arti-nama')
        .set('Content-Type', 'application/json')
        .query({ nama: 'Otong Surotong' })
        .expect(200);
    },
    App.defaultTimeout,
  );

  test(
    'GET /api/pasangan',
    async () => {
      await supertest(app)
        .get('/api/pasangan')
        .set('Content-Type', 'application/json')
        .query({ nama1: 'Otong Surotong', nama2: 'Reita Ray' })
        .expect(200);
    },
    App.defaultTimeout,
  );

  test(
    'GET /api/penyakit',
    async () => {
      await supertest(app)
        .get('/api/penyakit')
        .set('Content-Type', 'application/json')
        .query({ tanggal: '11-12-2000' })
        .expect(200);
    },
    App.defaultTimeout,
  );

  test(
    'GET /api/pekerjaan',
    async () => {
      await supertest(app)
        .get('/api/penyakit')
        .set('Content-Type', 'application/json')
        .query({ tanggal: '11-12-2000' })
        .expect(200);
    },
    App.defaultTimeout,
  );
});
