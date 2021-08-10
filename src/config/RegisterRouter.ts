import { Router as ExpressRouter } from 'express';
import ErrorHandlerRoute from '@routes/error-handler.route';
import HomeRoute from '@routes/public/home.route';
import BMKGRoute from '@routes/api/forecast.route';
import SocialRoute from '@routes/api/social.route';
import AnimeRoute from '@routes/api/anime.route';
import FilmRoute from '@routes/api/film.route';
import OtherRoute from '@routes/api/other.route';
import ReligionRoute from '@routes/api/religion.route';

export class RegisterRouter {
  protected api(): Array<Array<ExpressRouter>> {
    return [
      new AnimeRoute().route(),
      new BMKGRoute().route(),
      new FilmRoute().route(),
      new ReligionRoute().route(),
      new SocialRoute().route(),
      new OtherRoute().route(),
    ];
  }

  protected public(): Array<Array<ExpressRouter>> {
    return [new HomeRoute().route()];
  }

  protected errorHandler(): Array<any> {
    return new ErrorHandlerRoute().route();
  }
}
