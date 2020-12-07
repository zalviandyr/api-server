const { JadwalSholatController } = require('controllers/religion/jadwal-sholat.controller')
const { QuranController } = require('controllers/religion/quran.controller')
const { SuratController } = require('controllers/religion/surat.controller')
const { AlkitabController } = require('controllers/religion/alkitab.controller')
const { Controller } = require('cores/Controller')

class ReligionRoute extends Controller {
    route() {
        return [
            this.get('/jadwal-sholat', (req, res) => new JadwalSholatController(req, res).controller()),
            this.get('/quran', (req, res) => new QuranController(req, res).controller()),
            this.get('/surat', (req, res) => new SuratController(req, res).controller()),
            this.get('/alkitab', (req, res) => new AlkitabController(req, res).controller()),
        ]
    }
}

module.exports = { ReligionRoute }
