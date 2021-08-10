import { Router as ExpressRouter } from 'express';
import Router from '@core/Router';
import ReligionController from '@api/religion/religion.controller';
import MuslimController from '@api/religion/muslim/muslim.controller';
import RandomController from '@api/religion/muslim/random.controller';
import QuranController from '@api/religion/muslim/quran.controller';

export default class ReligionRoute extends Router {
  route(): Array<ExpressRouter> {
    return [
      this.get('/alkitab', ReligionController, 'alkitab'),

      // muslim
      this.get('/muslim/jadwal-sholat', MuslimController, 'jadwalSholat'),
      this.get(
        '/muslim/jadwal-sholat/:kota',
        MuslimController,
        'jadwalSholatKota',
      ),

      // muslim/random
      this.get('/muslim/random/ayat', RandomController, 'ayat'),

      // muslim/quran
      this.get('/muslim/quran', QuranController, 'quran'),
      this.get('/muslim/quran/:surat', QuranController, 'quranSurat'),
      this.get('/muslim/quran/:surat/:ayat', QuranController, 'quranSuratAyat'),
    ];
  }
}
