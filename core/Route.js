/* eslint-disable class-methods-use-this */
const { HomeRoute } = require('routes/home.route');
const { BMKGRoute } = require('routes/bmkg.route');
const { OthersRoute } = require('routes/others.route');
const { ReligionRoute } = require('routes/religion.route');
const { SocialRoute } = require('routes/social.route');
const { ScrapeRoute } = require('routes/scrape.route');
const { YoutubeRoute } = require('routes/youtube.route');

class Route {
    api() {
        return [
            new BMKGRoute().route(),
            new OthersRoute().route(),
            new ReligionRoute().route(),
            new ScrapeRoute().route(),
            new SocialRoute().route(),
            new YoutubeRoute().route(),
        ];
    }

    public() {
        return [
            new HomeRoute().route(),
        ];
    }
}

module.exports = { Route };
