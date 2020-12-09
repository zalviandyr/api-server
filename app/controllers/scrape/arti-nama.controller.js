const cheerio = require('cheerio')
const axios = require('axios')
const { CustomMessage } = require('helpers/CustomMessage')

class ArtiNamaController {
    constructor(req, res) {
        this.request = req
        this.response = res
    }

    async controller() {
        const { request, response } = this
        let { nama } = request.query
        if (!nama) {
            return new CustomMessage(response).error({
                status_code: 400,
                message: 'Silahkan isi query nama',
            }, 400)
        }

        try {
            nama = nama.replace(/ /g, '+')
            const url = `https://www.primbon.com/arti_nama.php?nama1=${nama}&proses=+Submit%21+`
            const { data } = await axios.get(url)
            const selector = cheerio.load(data)
            const result = selector('div[id="container"]').find('div[id="body"]')

            // remove unnecessary data
            const dataTrim = result.text().split('Nama:')[0].trim().replace('ARTI NAMA', '')
            const dataSplit = dataTrim.split('\n\n')

            const resultResponse = {
                arti: dataSplit[0].trim(),
                deskripsi: dataSplit[1].trim(),
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

module.exports = { ArtiNamaController }
