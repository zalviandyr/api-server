const axios = require('axios');
const querystring = require('querystring');
const cheerio = require('cheerio');
const moment = require('moment');
const { CustomMessage } = require('helpers/CustomMessage');

class PekerjaanController {
    constructor(req, res) {
        this.request = req;
        this.response = res;
    }

    async controller() {
        const { request, response } = this;
        const { tanggal } = request.query;
        if (!tanggal) {
            return new CustomMessage(response).error({
                status_code: 400,
                message: 'Silahkan isi query tanggal DD-MM-YYYY, contoh: ?tanggal=01-12-2020',
            }, 400);
        }

        // check date is valid
        const m = moment(tanggal, 'DD-MM-YYYY');
        const url = 'https://primbon.com/pekerjaan_weton_lahir.php';

        if (!m.isValid()) {
            return new CustomMessage(response).error({
                status_code: 400,
                message: 'Silahkan isi query tanggal DD-MM-YYYY, contoh: ?tanggal=01-12-2020',
            }, 400);
        }

        try {
            const dataPost = {
                tgl: m.date(),
                bln: (m.month() + 1),
                thn: m.year(),
                submit: 'Submit!',
            };
            const { data } = await axios.post(url, querystring.stringify(dataPost));
            const selector = cheerio.load(data);
            const result = selector('div[id="container"]').find('div[id="body"]');

            // remove unnecessary data
            result.find('br').replaceWith('\n');
            const dataText = result.text();
            const array = dataText.split('\n').filter((f) => f !== '');
            const resultResponse = {
                hari_lahir: array[1].split(':')[1].trim(),
                deskripsi: array[2],
            };

            return new CustomMessage(response).success(resultResponse);
        } catch (err) {
            return new CustomMessage(response).error({
                status_code: 500,
                message: err.message,
            }, 500);
        }
    }
}

module.exports = { PekerjaanController };
