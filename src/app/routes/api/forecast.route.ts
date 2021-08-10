import { Router as ExpressRouter } from 'express';
import Router from '@core/Router';
import BMKGController from '@api/forecast/bmkg.controller';
import PrimbonController from '@api/forecast/primbon.controller';

export default class BMKGRoute extends Router {
  route(): Array<ExpressRouter> {
    return [
      this.get('/info-gempa', BMKGController, 'infoGempa'),
      this.get('/cuaca', BMKGController, 'cuaca'),
      this.get('/arti-nama', PrimbonController, 'artiNama'),
      this.get('/pasangan', PrimbonController, 'pasangan'),
      this.get('/pekerjaan', PrimbonController, 'pekerjaan'),
      this.get('/penyakit', PrimbonController, 'penyakit'),
    ];
  }
}
