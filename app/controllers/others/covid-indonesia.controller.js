const axios = require('axios')
const { CustomMessage } = require('helpers/CustomMessage')

class CovidIndonesiaController {
    constructor(req, res) {
        this.request = req
        this.response = res
    }

    async controller() {
        const { response } = this
        try {
            const url = 'https://apicovid19indonesia-v2.vercel.app/api/indonesia'

            const result = await axios.get(url)
            const localDate = new Date(result.data.lastUpdate)
            const lastUpdate = localDate.toLocaleString()

            const resultResponse = {
                positif: result.data.positif,
                dirawat: result.data.dirawat,
                sembuh: result.data.sembuh,
                meninggal: result.data.meninggal,
                last_update: lastUpdate,
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

module.exports = { CovidIndonesiaController }
