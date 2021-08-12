import { Express } from 'express';
import supertest from 'supertest';
import App from '../app';
import { SpeechLangList } from '@helpers/enums';

describe('API Server Test - API / Other', () => {
  const app: Express = new App().init();

  test(
    'GET /api/translate',
    async () => {
      await supertest(app)
        .get('/api/translate')
        .set('Content-Type', 'application/json')
        .query({ text: 'Hello World' })
        .expect(200);
    },
    App.defaultTimeout,
  );

  test(
    'GET /api/speech',
    async () => {
      await supertest(app)
        .get('/api/speech')
        .set('Content-Type', 'application/json')
        .expect(200);
    },
    App.defaultTimeout,
  );

  for (let i = 0; i < Object.values(SpeechLangList).length; i++) {
    const lang = Object.values(SpeechLangList)[i];
    test(
      `GET /api/speech/${lang}`,
      async () => {
        await supertest(app).get(`/api/speech/${lang}`).expect(400);
      },
      App.defaultTimeout,
    );
  }

  test(
    'GET /api/covid-indonesia',
    async () => {
      await supertest(app)
        .get('/api/covid-indonesia')
        .set('Content-Type', 'application/json')
        .expect(200);
    },
    App.defaultTimeout,
  );

  test(
    'GET /api/kabupaten-kota',
    async () => {
      await supertest(app)
        .get('/api/kabupaten-kota')
        .set('Content-Type', 'application/json')
        .expect(200);
    },
    App.defaultTimeout,
  );

  test(
    'GET /api/kabupaten-kota/:provinsi',
    () => {
      supertest(app)
        .get('/api/kabupaten-kota')
        .set('Content-Type', 'application/json')
        .then(async (res: supertest.Response) => {
          const { result } = res.body;
          for (let i = 0; i < result.length; i++) {
            const provinsi = result[i].nama;
            await supertest(app)
              .get(`/api/kabupaten-kota/${provinsi}`)
              .set('Content-Type', 'application/json')
              .expect(200);
          }
        });
    },
    App.defaultTimeout,
  );

  test(
    'GET /api/quote',
    async () => {
      await supertest(app)
        .get('/api/quote')
        .set('Content-Type', 'application/json')
        .expect(200);
    },
    App.defaultTimeout,
  );

  test(
    'GET /api/quote',
    () => {
      supertest(app)
        .get('/api/quote')
        .set('Content-Type', 'application/json')
        .then(async (res: supertest.Response) => {
          const genreList = res.body.result;
          for (let i = 0; i < genreList.length; i++) {
            const genre = genreList[i];
            await supertest(app)
              .get(`/api/quote/${genre}`)
              .set('Content-Type', 'application/json')
              .expect(200);
          }
        });
    },
    App.defaultTimeout,
  );

  test('GET /api/quote-maker', async () => {
    await supertest(app)
      .get('/api/quote-maker')
      .set('Content-Type', 'application/json')
      .query({ author: 'Otong Surotong', quote: 'Hidup seperti larry' })
      .expect(200);
  });

  test('GET /api/bosan', async () => {
    await supertest(app)
      .get('/api/bosan')
      .set('Content-Type', 'application/json')
      .expect(200);
  });

  test('GET /api/meme', async () => {
    await supertest(app)
      .get('/api/meme')
      .set('Content-Type', 'application/json')
      .expect(200);
  });

  test('GET /api/saweria', async () => {
    await supertest(app)
      .get('/api/saweria')
      .set('Content-Type', 'application/json')
      .expect(200);
  });

  test('GET /api/lirik', async () => {
    await supertest(app)
      .get('/api/lirik')
      .set('Content-Type', 'application/json')
      .query({ search: 'mitis moments' })
      .expect(200);
  }, 30000);

  test('GET /api/wiki', async () => {
    await supertest(app)
      .get('/api/wiki')
      .set('Content-Type', 'application/json')
      .query({ search: 'linux' })
      .expect(200);
  });
});
