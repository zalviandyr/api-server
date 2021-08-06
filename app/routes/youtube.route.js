const { YtAudioController } = require('controllers/youtube/yt-audio.controller');
const { YtVideoController } = require('controllers/youtube/yt-video.controller');
const { YtSearchController } = require('controllers/youtube/yt-search.controller');
const { Controller } = require('cores/Controller');

class YoutubeRoute extends Controller {
    route() {
        return [
            this.get('/yt-audio', (req, res) => new YtAudioController(req, res).controller()),
            this.get('/yt-video', (req, res) => new YtVideoController(req, res).controller()),
            this.get('/yt-search', (req, res) => new YtSearchController(req, res).controller()),
        ];
    }
}

module.exports = { YoutubeRoute };
