import { Router as ExpressRouter } from 'express';
import Router from '@core/Router';
import HomeController from '@controllers/public/home.controller';

export default class HomeRoute extends Router {
  route(): Array<ExpressRouter> {
    return [this.get('/', HomeController, 'home')];
  }
}
