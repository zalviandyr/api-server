const axios = require('axios')
const { transform } = require('camaro')
const { CustomMessage } = require('helpers/CustomMessage')

class InfoGempaController {
    constructor(req, res) {
        this.request = req
        this.response = res
    }

    controller() {
        const { response } = this
        const urlGempa = 'https://data.bmkg.go.id/autogempa.xml'
        const urlGif = 'https://data.bmkg.go.id/eqmap.gif'

        axios({
            url: urlGempa,
            responseType: 'text',
        }).then(async (result) => {
            const template = ['Infogempa/gempa', {
                tanggal: 'Tanggal',
                jam: 'Jam',
                lintang: 'Lintang',
                bujur: 'Bujur',
                magnitude: 'Magnitude',
                kedalaman: 'Kedalaman',
                potensi: 'Potensi',
                wilayah1: 'Wilayah1',
                wilayah2: 'Wilayah2',
                wilayah3: 'Wilayah3',
                wilayah4: 'Wilayah4',
                wilayah5: 'Wilayah5',
            }]

            const tr = await transform(result.data, template)
            tr[0].gif = urlGif
            return new CustomMessage(response).success(tr[0])
        }).catch((err) => new CustomMessage(response).error({
            status_code: 500,
            message: err.message,
        }, 500))
    }
}

module.exports = { InfoGempaController }
