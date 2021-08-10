import { Router as ExpressRouter } from 'express';

import Router from '@core/Router';
import MovieController from '@api/film/movie.controller';
import DrakorController from '@api/film/drakor.controller';

export default class FilmRoute extends Router {
  route(): Array<ExpressRouter> {
    return [
      this.get('/movie', MovieController, 'movie'),
      this.get('/movie2', MovieController, 'movie2'),
      this.get('/drakorasia', DrakorController, 'drakorasia'),
    ];
  }
}
