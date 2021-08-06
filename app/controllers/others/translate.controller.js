const translate = require('@k3rn31p4nic/google-translate-api');
const { CustomMessage } = require('helpers/CustomMessage');

class TranslateController {
    constructor(req, res) {
        this.request = req;
        this.response = res;
    }

    async controller() {
        const { request, response } = this;
        const { text } = request.query;

        try {
            if (text) {
                const result = await translate(text, { to: 'id' });
                const resultResponse = {
                    text: result.text,
                    typo: result.from.text.value,
                    from: result.from.language.iso,
                    to: 'id',
                };

                return new CustomMessage(response).success(resultResponse);
            }
            return new CustomMessage(response).error({
                status_code: 400,
                message: 'Silahkan input query text, contoh: ?text=こんにちは',
            }, 500);
        } catch (err) {
            return new CustomMessage(response).error({
                status_code: 500,
                message: err.message,
            }, 500);
        }
    }
}

module.exports = { TranslateController };
