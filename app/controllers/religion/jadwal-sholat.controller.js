const axios = require('axios');
const { CustomMessage } = require('helpers/CustomMessage');

class JadwalSholatController {
    constructor(req, res) {
        this.request = req;
        this.response = res;
    }

    async controller() {
        const { request, response } = this;
        const { kota } = request.query;

        try {
            if (kota) {
                const today = new Date().toISOString().slice(0, 10).split('-');
                const url = `https://raw.githubusercontent.com/lakuapik/jadwalsholatorg/master/adzan/${kota}/${today[0]}/${today[1]}.json`;

                const { data } = await axios.get(url);
                // eslint-disable-next-line radix
                const dateToday = parseInt(today[2]) - 1;
                return new CustomMessage(response).success(data[dateToday]);
            }

            const url = 'https://raw.githubusercontent.com/lakuapik/jadwalsholatorg/master/kota.json';
            const result = await axios.get(url);
            const resultKota = {
                message: 'Silahkan masukan query kota untuk mendapatkan jadwal spesifik, contoh ?kota=muarabungo',
                kota: result.data,
            };
            return new CustomMessage(response).success(resultKota);
        } catch (err) {
            return new CustomMessage(response).error({
                status_code: 500,
                message: err.message,
            }, 500);
        }
    }
}

module.exports = { JadwalSholatController };
