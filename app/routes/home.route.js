const { HomeController } = require('controllers/home.controller')
const { Controller } = require('cores/Controller')

class HomeRoute extends Controller {
    route() {
        return this.get('/', (req, res) => new HomeController(req, res).controller())
    }
}

module.exports = { HomeRoute }
