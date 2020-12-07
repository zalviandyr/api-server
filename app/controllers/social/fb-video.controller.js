const fbVideos = require('fbvideos')
const { CustomMessage } = require('helpers/CustomMessage')

class FbVideoController {
    constructor(req, res) {
        this.request = req
        this.response = res
    }

    async controller() {
        const { request, response } = this
        const { url } = request.query

        if (!url) {
            return new CustomMessage(response).error({
                status_code: 400,
                message: 'Silahkan input query url, contoh: ?url=https://facebook.com/video',
            }, 400)
        }

        try {
            const result = await fbVideos.low(url)
            return new CustomMessage(response).success({ url: result.url })
        } catch (err) {
            return new CustomMessage(response).error({
                status_code: 500,
                message: err.message,
            }, 500)
        }
    }
}

module.exports = { FbVideoController }
