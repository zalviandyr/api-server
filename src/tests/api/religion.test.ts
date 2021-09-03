import { Express } from 'express';
import supertest from 'supertest';
import fs from 'fs';
import App from '../app';
import Filepath from '@helpers/filepath';

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

describe('/ Muslim', () => {
  const app: Express = new App().init();
  const path = Filepath.muslim.nabi.list;
  const data = fs.readFileSync(path, 'utf8');
  const json = JSON.parse(data);

  test(
    'GET /api/muslim/jadwal-shalat',
    async () => {
      await supertest(app)
        .get('/api/muslim/jadwal-shalat')
        .set('Content-Type', 'application/json')
        .expect(200);
    },
    App.defaultTimeout,
  );

  test(
    'GET /api/muslim/jadwal-shalat/:kota',
    () => {
      supertest(app)
        .get('/api/muslim/jadwal-shalat')
        .set('Content-Type', 'application/json')
        .then(async (res: supertest.Response) => {
          const { result } = res.body;
          for (let i = 0; i < result.length; i++) {
            const kota = result[i];
            await supertest(app)
              .get(`/api/muslim/jadwal-shalat/${kota}`)
              .set('Content-Type', 'application/json')
              .expect(200);
          }
        });
    },
    App.defaultTimeout,
  );

  test(
    'GET /api/muslim/bacaan-shalat',
    async () => {
      await supertest(app)
        .get('/api/muslim/bacaan-shalat')
        .set('Content-Type', 'application/json')
        .expect(200);
    },
    App.defaultTimeout,
  );

  test(
    'GET /api/muslim/niat-shalat',
    async () => {
      await supertest(app)
        .get('/api/muslim/niat-shalat')
        .set('Content-Type', 'application/json')
        .expect(200);
    },
    App.defaultTimeout,
  );

  test(
    'GET /api/muslim/asmaul-husna',
    async () => {
      await supertest(app)
        .get('/api/muslim/asmaul-husna')
        .set('Content-Type', 'application/json')
        .expect(200);
    },
    App.defaultTimeout,
  );

  describe('/ Random', () => {
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
      'GET /api/muslim/random/quote',
      async () => {
        await supertest(app)
          .get('/api/muslim/random/quote')
          .set('Content-Type', 'application/json')
          .expect(200);
      },
      App.defaultTimeout,
    );

    test(
      'GET /api/muslim/random/asmaul-husna',
      async () => {
        await supertest(app)
          .get('/api/muslim/random/asmaul-husna')
          .set('Content-Type', 'application/json')
          .expect(200);
      },
      App.defaultTimeout,
    );

    test(
      'GET /api/muslim/random/wallpaper',
      async () => {
        await supertest(app)
          .get('/api/muslim/random/wallpaper')
          .set('Content-Type', 'application/json')
          .expect(200);
      },
      App.defaultTimeout,
    );
  });

  describe('/ Nabi', () => {
    test(
      'GET /api/muslim/nabi',
      async () => {
        await supertest(app)
          .get('/api/muslim/nabi')
          .set('Content-Type', 'application/json')
          .expect(200);
      },
      App.defaultTimeout,
    );

    for (let i = 0; i < json.length; i++) {
      const slugNabi = json[i].slug;

      test(
        `GET /api/muslim/nabi/${slugNabi}`,
        async () => {
          await supertest(app)
            .get(`/api/muslim/nabi/${slugNabi}`)
            .set('Content-Type', 'application/json')
            .expect(200);
        },
        App.defaultTimeout,
      );
    }
  });

  describe('/ Doa', () => {
    test(
      'GET /api/muslim/doa/ayat-kursi',
      async () => {
        await supertest(app)
          .get('/api/muslim/doa/ayat-kursi')
          .set('Content-Type', 'application/json')
          .expect(200);
      },
      App.defaultTimeout,
    );

    test(
      'GET /api/muslim/doa/harian',
      async () => {
        await supertest(app)
          .get('/api/muslim/doa/harian')
          .set('Content-Type', 'application/json')
          .expect(200);
      },
      App.defaultTimeout,
    );

    test(
      'GET /api/muslim/doa/tahlil',
      async () => {
        await supertest(app)
          .get('/api/muslim/doa/tahlil')
          .set('Content-Type', 'application/json')
          .expect(200);
      },
      App.defaultTimeout,
    );

    test(
      'GET /api/muslim/doa/wirid',
      async () => {
        await supertest(app)
          .get('/api/muslim/doa/wirid')
          .set('Content-Type', 'application/json')
          .expect(200);
      },
      App.defaultTimeout,
    );
  });

  describe('/ Quran', () => {
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
      'GET /api/muslim/quran/:surat/ayat',
      async () => {
        await supertest(app)
          .get('/api/muslim/quran/1')
          .set('Content-Type', 'application/json')
          .expect(200);
      },
      App.defaultTimeout,
    );
  });
});
