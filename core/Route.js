const { BMKGRoute } = require('routes/bmkg.route')
const { HomeRoute } = require('routes/home.route')
const { OthersRoute } = require('routes/others.route')
const { ReligionRoute } = require('routes/religion.route')
const { SocialRoute } = require('routes/social.route')
const { ScrapeRoute } = require('routes/scrape.route')
const { YoutubeRoute } = require('routes/youtube.route')

class Route {
    // eslint-disable-next-line class-methods-use-this
    init() {
        return [
            new BMKGRoute().route(),
            new HomeRoute().route(),
            new OthersRoute().route(),
            new ReligionRoute().route(),
            new ScrapeRoute().route(),
            new SocialRoute().route(),
            new YoutubeRoute().route(),
        ]
    }
}

module.exports = { Route }
