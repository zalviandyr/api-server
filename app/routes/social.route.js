const { FbVideoController } = require('controllers/social/fb-video.controller')
const { IgProfileController } = require('controllers/social/ig-profile.controller')
const { Controller } = require('cores/Controller')

class SocialRoute extends Controller {
    route() {
        return [
            this.get('/fb-video', (req, res) => new FbVideoController(req, res).controller()),
            this.get('/ig-profile', (req, res) => new IgProfileController(req, res).controller()),
        ]
    }
}

module.exports = { SocialRoute }
