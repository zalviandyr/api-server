const fs = require('fs').promises;
const { filePath } = require('helpers/values');
const { CustomMessage } = require('helpers/CustomMessage');

class KabupatenKotaController {
    constructor(req, res) {
        this.request = req;
        this.response = res;
    }

    async controller() {
        const { request, response } = this;
        const { provinsi } = request.query;
        const path = filePath.kabupatenKota;

        try {
            if (provinsi) {
                const result = await fs.readFile(path, 'utf8');
                const json = JSON.parse(result);
                for (let i = 0; i < json.length; i++) {
                    if (provinsi.toLowerCase() === json[i].nama.toLowerCase()) {
                        return new CustomMessage(response).success(json[i]);
                    }
                }

                return new CustomMessage(response).error({
                    status_code: 404,
                    message: 'Provinsi not found',
                }, 404);
            }

            const result = await fs.readFile(path, 'utf8');
            return new CustomMessage(response).success(JSON.parse(result));
        } catch (err) {
            return new CustomMessage(response).error({
                status_code: 500,
                message: err.message,
            }, 500);
        }
    }
}

module.exports = { KabupatenKotaController };
