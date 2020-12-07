const axios = require('axios')
const { CustomMessage } = require('helpers/CustomMessage')

class MemeController {
    constructor(req, res) {
        this.request = req
        this.response = res
    }

    async controller() {
        const { response } = this
        try {
            const url = 'https://meme-api.herokuapp.com/gimme'
            const result = await axios.get(url)
            const resultResponse = {
                post_link: result.data.postLink,
                subreddit: result.data.subreddit,
                title: result.data.title,
                author: result.data.author,
                url: result.data.url,
            }

            return new CustomMessage(response).success(resultResponse)
        } catch (err) {
            return new CustomMessage(response).error({
                status_code: 500,
                message: err.message,
            }, 500)
        }
    }
}

module.exports = { MemeController }
