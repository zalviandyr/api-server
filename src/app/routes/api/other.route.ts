import { Router as ExpressRouter } from 'express';
import Router from '@core/Router';
import TranslationController from '@api/other/translation.controller';
import IndonesiaController from '@api/other/indonesia.controller';
import QuoteController from '@api/other/quote.controller';
import OtherController from '@api/other/other.controller';

export default class OtherRoute extends Router {
  route(): Array<ExpressRouter> {
    return [
      this.get('/translate', TranslationController, 'translate'),
      this.get('/speech', TranslationController, 'speech'),
      this.get('/speech/:lang', TranslationController, 'speechLang'),
      this.get('/covid-indonesia', IndonesiaController, 'covidIndonesia'),
      this.get('/kabupaten-kota', IndonesiaController, 'kabupatenKota'),
      this.get(
        '/kabupaten-kota/:provinsi',
        IndonesiaController,
        'kabupatenKotaProvinsi',
      ),
      this.get('/quote', QuoteController, 'quote'),
      this.get('/quote/:genre', QuoteController, 'quoteGenre'),
      this.get('/quote-maker', QuoteController, 'quoteMaker'),
      this.get('/bosan', OtherController, 'bosan'),
      this.get('/meme', OtherController, 'meme'),
      this.get('/saweria', OtherController, 'saweria'),
      this.get('/lirik', OtherController, 'lirik'),
      this.get('/wiki', OtherController, 'wiki'),
    ];
  }
}
