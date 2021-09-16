import { Router as ExpressRouter } from 'express';
import Router from '@core/Router';
import ReligionController from '@api/religion/religion.controller';
import MuslimController from '@api/religion/muslim/muslim.controller';
import RandomController from '@api/religion/muslim/random.controller';
import QuranController from '@api/religion/muslim/quran.controller';
import DoaController from '@api/religion/muslim/doa.controller';
import NabiController from '@api/religion/muslim/nabi.controller';

export default class ReligionRoute extends Router {
  route(): Array<ExpressRouter> {
    return [
      this.get('/alkitab', ReligionController, 'alkitab'),

      // muslim
      this.get('/muslim/jadwal-shalat', MuslimController, 'jadwalShalat'),
      this.get(
        '/muslim/jadwal-shalat/:kota',
        MuslimController,
        'jadwalShalatKota',
      ),
      this.get('/muslim/bacaan-shalat', MuslimController, 'bacaanShalat'),
      this.get('/muslim/niat-shalat', MuslimController, 'niatShalat'),
      this.get('/muslim/asmaul-husna', MuslimController, 'asmaulHusna'),
      this.get('/muslim/qiblat', MuslimController, 'qiblat'),

      // muslim/random
      this.get('/muslim/random/ayat', RandomController, 'ayat'),
      this.get('/muslim/random/asmaul-husna', RandomController, 'asmaulHusna'),
      this.get('/muslim/random/quote', RandomController, 'quote'),
      this.get('/muslim/random/wallpaper', RandomController, 'wallpaper'),

      // muslim/nabi
      this.get('/muslim/nabi', NabiController, 'list'),
      this.get('/muslim/nabi/:slugNabi', NabiController, 'kisah'),

      // muslim/doa
      this.get('/muslim/doa/ayat-kursi', DoaController, 'ayatKursi'),
      this.get('/muslim/doa/harian', DoaController, 'harian'),
      this.get('/muslim/doa/tahlil', DoaController, 'tahlil'),
      this.get('/muslim/doa/wirid', DoaController, 'wirid'),

      // muslim/quran
      this.get('/muslim/quran', QuranController, 'quran'),
      this.get('/muslim/quran/:surat', QuranController, 'quranSurat'),
      this.get('/muslim/quran/:surat/:ayat', QuranController, 'quranSuratAyat'),
    ];
  }
}
