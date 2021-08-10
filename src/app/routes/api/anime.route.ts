import { Router as ExpressRouter } from 'express';
import Router from '@core/Router';
import AnimeController from '@api/anime/anime.controller';
import ScrapeController from '@api/anime/scrape.controller';

export default class AnimeRoute extends Router {
  route(): Array<ExpressRouter> {
    return [
      this.get('/anime-pic', AnimeController, 'animePic'),
      this.get('/anime-pic/:genre', AnimeController, 'animePicGenre'),
      this.get('/what-anime', AnimeController, 'whatAnime'),
      this.get('/kusonime', ScrapeController, 'kusonime'),
      this.get('/neonime', ScrapeController, 'neonime'),
      this.get('/nekopoi', ScrapeController, 'nekopoi'),
      this.get('/manga', ScrapeController, 'manga'),
    ];
  }
}
