const axios = require('axios');
const { transform } = require('camaro');
const { CustomMessage } = require('helpers/CustomMessage');

class InfoGempaController {
    constructor(req, res) {
        this.request = req;
        this.response = res;
    }

    controller() {
        const { response } = this;
        const urlGempa = 'https://data.bmkg.go.id/DataMKG/TEWS/autogempa.xml';
        const urlImage = 'https://data.bmkg.go.id/DataMKG/TEWS/20210301020019.mmi.jpg';

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
                wilayah: 'Wilayah',
            }];

            const tr = await transform(result.data, template);
            tr[0].image = urlImage;
            return new CustomMessage(response).success(tr[0]);
        }).catch((err) => new CustomMessage(response).error({
            status_code: 500,
            message: err.message,
        }, 500));
    }
}

module.exports = { InfoGempaController };
