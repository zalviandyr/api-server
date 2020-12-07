const { CustomMessage } = require('helpers/CustomMessage')

class HomeController {
    constructor(req, res) {
        this.request = req
        this.response = res
    }

    controller() {
        const { response } = this
        return new CustomMessage(response).success('Rest api by Zukron Alviandy')
    }
}

module.exports = { HomeController }
