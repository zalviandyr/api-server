const { KusonimeController } = require('controllers/scrape/kusonime.controller')
const { ArtiNamaController } = require('controllers/scrape/arti-nama.controller')
const { PasanganController } = require('controllers/scrape/pasangan.controller')
const { PenyakitController } = require('controllers/scrape/penyakit.controller')
const { PekerjaanController } = require('controllers/scrape/pekerjaan.controller')
const { DrakorasiaController } = require('controllers/scrape/drakorasia.controller')
const { LirikController } = require('controllers/scrape/lirik.controller')
const { MovieController } = require('controllers/scrape/movie.controller')
const { Movie2Controller } = require('controllers/scrape/movie2.controller')
const { MangaController } = require('controllers/scrape/manga.controller')
const { WikipediaController } = require('controllers/scrape/wikipedia.controller')
const { Controller } = require('cores/Controller')

class ScrapeRoute extends Controller {
    route() {
        return [
            this.get('/kusonime', (req, res) => new KusonimeController(req, res).controller()),
            this.get('/arti-nama', (req, res) => new ArtiNamaController(req, res).controller()),
            this.get('/pasangan', (req, res) => new PasanganController(req, res).controller()),
            this.get('/penyakit', (req, res) => new PenyakitController(req, res).controller()),
            this.get('/pekerjaan', (req, res) => new PekerjaanController(req, res).controller()),
            this.get('/drakorasia', (req, res) => new DrakorasiaController(req, res).controller()),
            this.get('/lirik', (req, res) => new LirikController(req, res).controller()),
            this.get('/movie', (req, res) => new MovieController(req, res).controller()),
            this.get('/movie2', (req, res) => new Movie2Controller(req, res).controller()),
            this.get('/manga', (req, res) => new MangaController(req, res).controller()),
            this.get('/wiki', (req, res) => new WikipediaController(req, res).controller()),
        ]
    }
}

module.exports = { ScrapeRoute }
