import { Response } from 'express';
import Controller from '@core/Controller';

export default class HomeController extends Controller {
  home(): Response {
    const response = {
      author: 'ZalviandyR',
      github: 'https://github.com/zalviandyr/api-server',
      message: 'Rest api by Zukron Alviandy',
    };

    return this.successResponse(response);
  }
}
