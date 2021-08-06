const { KabupatenKotaController } = require('controllers/others/kabupaten-kota.controller');
const { CovidIndonesiaController } = require('controllers/others/covid-indonesia.controller');
const { QuoteMakerController } = require('controllers/others/quote-maker.controller');
const { MemeController } = require('controllers/others/meme.controller');
const { TranslateController } = require('controllers/others/translate.controller');
const { BosanController } = require('controllers/others/bosan.controller');
const { AnimePicController } = require('controllers/others/anime-pic.controller');
const { SpeechController } = require('controllers/others/speech.controller');
const { QuoteController } = require('controllers/others/quote.controller');
const { WhatAnimeController } = require('controllers/others/what-anime.controller');
const { SaweriaController } = require('controllers/others/saweria.controller');
const { Controller } = require('cores/Controller');

class OthersRoute extends Controller {
    route() {
        return [
            this.get('/kabupaten-kota', (req, res) => new KabupatenKotaController(req, res).controller()),
            this.get('/covid-indonesia', (req, res) => new CovidIndonesiaController(req, res).controller()),
            this.get('/quote-maker', (req, res) => new QuoteMakerController(req, res).controller()),
            this.get('/meme', (req, res) => new MemeController(req, res).controller()),
            this.get('/translate', (req, res) => new TranslateController(req, res).controller()),
            this.get('/bosan', (req, res) => new BosanController(req, res).controller()),
            this.get('/anime-pic', (req, res) => new AnimePicController(req, res).controller()),
            this.get('/speech', (req, res) => new SpeechController(req, res).controller()),
            this.get('/quote', (req, res) => new QuoteController(req, res).controller()),
            this.get('/what-anime', (req, res) => new WhatAnimeController(req, res).controller()),
            this.post('/what-anime', (req, res) => new WhatAnimeController(req, res).controller()),
            this.get('/saweria', (req, res) => new SaweriaController(req, res).controller()),
        ];
    }
}

module.exports = { OthersRoute };
