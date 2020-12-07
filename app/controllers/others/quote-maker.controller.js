const axios = require('axios')
const { CustomMessage } = require('helpers/CustomMessage')

class QuoteMakerController {
    constructor(req, res) {
        this.request = req
        this.response = res
    }

    async controller() {
        const { request, response } = this
        const { author, quote } = request.query

        try {
            if (author && quote) {
                const url = `https://terhambar.com/aw/qts/?kata=${quote}&author=${author}&tipe=random`
                const result = await axios.get(url)
                return new CustomMessage(response).success(result.data)
            }

            return new CustomMessage(response).error({
                status_code: 400,
                message: 'Silahkan masukkan query author dan quote, contoh: ?author=sae kadal&quote=wayahe wayahe',
            }, 400)
        } catch (err) {
            return new CustomMessage(response).error({
                status_code: 500,
                message: err.message,
            }, 500)
        }
    }
}

module.exports = { QuoteMakerController }
