import { Express } from 'express';
import supertest from 'supertest';
import App from '../app';

describe('API Server Test - API / Social', () => {
  const app: Express = new App().init();

  test(
    'GET /api/tiktok',
    async () => {
      await supertest(app)
        .get('/api/tiktok')
        .set('Content-Type', 'application/json')
        .query({
          url: 'https://www.tiktok.com/@nattganteng/video/6961831473045359874',
        })
        .expect(200);
    },
    App.defaultTimeout,
  );

  test(
    'GET /api/ig',
    async () => {
      await supertest(app)
        .get('/api/ig')
        .set('Content-Type', 'application/json')
        .query({
          url: 'https://www.instagram.com/p/CSO-tNbBp6I/?utm_source=ig_web_copy_link',
        })
        .expect(200);
    },
    App.defaultTimeout,
  );

  test(
    'GET /api/ig-profile',
    async () => {
      await supertest(app)
        .get('/api/ig-profile')
        .set('Content-Type', 'application/json')
        .query({ username: 'zukronalviandy11' })
        .expect(200);
    },
    App.defaultTimeout,
  );

  test(
    'GET /api/fb-video',
    async () => {
      await supertest(app)
        .get('/api/fb-video')
        .set('Content-Type', 'application/json')
        .query({ url: 'https://fb.watch/7gEXP7VDTH/' })
        .expect(200);
    },
    App.defaultTimeout,
  );

  test(
    'GET /api/yt-search',
    async () => {
      await supertest(app)
        .get('/api/yt-search')
        .set('Content-Type', 'application/json')
        .query({ search: 'boku no hero' })
        .expect(200);
    },
    App.defaultTimeout,
  );

  test(
    'GET /api/yt-audio',
    async () => {
      await supertest(app)
        .get('/api/yt-audio')
        .set('Content-Type', 'application/json')
        .query({ url: 'https://www.youtube.com/watch?v=raZ22iX5J18' })
        .expect(200);
    },
    App.defaultTimeout,
  );

  test(
    'GET /api/yt-video',
    async () => {
      await supertest(app)
        .get('/api/yt-video')
        .set('Content-Type', 'application/json')
        .query({ url: 'https://www.youtube.com/watch?v=raZ22iX5J18' })
        .expect(200);
    },
    App.defaultTimeout,
  );
});
