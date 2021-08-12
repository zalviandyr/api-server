import { Express } from 'express';
import supertest from 'supertest';
import { ListGenreAnimePic } from '@helpers/enums';
import App from '../app';

describe('API Server Test - API / Anime', () => {
  const app: Express = new App().init();

  test(
    'GET /api/anime-pic',
    async () => {
      await supertest(app)
        .get('/api/anime-pic')
        .set('Content-Type', 'application/json')
        .expect(200);
    },
    App.defaultTimeout,
  );

  test(
    'GET /api/anime-pic/:genre',
    async () => {
      await supertest(app)
        .get('/api/anime-pic')
        .set('Content-Type', 'application/json')
        .expect(200);
    },
    App.defaultTimeout,
  );

  for (let i = 0; i < Object.values(ListGenreAnimePic).length; i++) {
    const genre = Object.values(ListGenreAnimePic)[i];
    test(
      `GET /api/anime-pic/${genre}`,
      async () => {
        await supertest(app)
          .get(`/api/anime-pic/${genre}`)
          .set('Content-Type', 'application/json')
          .expect(200);
      },
      App.defaultTimeout,
    );
  }

  test(
    'GET /api/what-anime',
    async () => {
      await supertest(app)
        .get('/api/what-anime')
        .set('Content-Type', 'application/json')
        .query({
          url: 'https://static2.cbrimages.com/wordpress/wp-content/uploads/2020/01/Monogatari-Featured.jpg',
        })
        .expect(200);
    },
    App.defaultTimeout,
  );

  test(
    'GET /api/kusonime',
    async () => {
      await supertest(app)
        .get('/api/kusonime')
        .set('Content-Type', 'application/json')
        .query({ search: 'dr stone' })
        .expect(200);
    },
    App.defaultTimeout,
  );

  test(
    'GET /api/neonime',
    async () => {
      await supertest(app)
        .get('/api/neonime')
        .set('Content-Type', 'application/json')
        .query({ search: 'one piece' })
        .expect(200);
    },
    App.defaultTimeout,
  );

  test(
    'GET /api/nekopoi',
    async () => {
      await supertest(app)
        .get('/api/nekopoi')
        .set('Content-Type', 'application/json')
        .expect(200);
    },
    App.defaultTimeout,
  );

  test(
    'GET /api/manga',
    async () => {
      await supertest(app)
        .get('/api/manga')
        .set('Content-Type', 'application/json')
        .query({ search: 'dr stone' })
        .expect(200);
    },
    App.defaultTimeout,
  );
});
