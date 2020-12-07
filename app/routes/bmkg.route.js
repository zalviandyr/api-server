const { Controller } = require('cores/Controller')
const { InfoGempaController } = require('controllers/bmkg/info-gempa.controller')
const { CuacaController } = require('controllers/bmkg/cuaca.controller')

class BMKGRoute extends Controller {
    route() {
        return [
            this.get('/info-gempa', (req, res) => new InfoGempaController(req, res).controller()),
            this.get('/cuaca', (req, res) => new CuacaController(req, res).controller()),
        ]
    }
}

module.exports = { BMKGRoute }
