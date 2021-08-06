const { CustomMessage } = require('helpers/CustomMessage');

class HomeController {
    constructor(req, res) {
        this.request = req;
        this.response = res;
    }

    controller() {
        const { response } = this;
        return new CustomMessage(response).success({
            author: 'ZalviandyR',
            github: 'https://github.com/zalviandyr/api-server',
            message: 'Rest api by Zukron Alviandy',
        });
    }
}

module.exports = { HomeController };
