const fs = require('fs').promises;
const translate = require('@k3rn31p4nic/google-translate-api');
const axios = require('axios');
const { CustomMessage } = require('helpers/CustomMessage');
const { filePath } = require('helpers/values');

class QuoteController {
    constructor(req, res) {
        this.request = req;
        this.response = res;
    }

    async controller() {
        const { request, response } = this;
        const { type } = request.query;

        if (!type) {
            return new CustomMessage(response).error({
                status_code: 400,
                message: 'Silahkan input type, contoh: ?type=random',
            }, 400);
        }

        try {
            const pathQuotes = filePath.quotes;
            const typeList = ['random', 'kanye', 'agamis'];

            if (typeList.includes(type)) {
                const resultResponse = { text_en: '', text_id: '', author: '' };
                if (type === 'random') {
                    const result = await fs.readFile(pathQuotes, 'utf8');
                    const quoteJson = JSON.parse(result);
                    const random = Math.floor(Math.random() * quoteJson.length);

                    const resultTranslate = await translate(quoteJson[random].text, { to: 'id' });
                    resultResponse.text_en = quoteJson[random].text;
                    resultResponse.text_id = resultTranslate.text;
                    resultResponse.author = quoteJson[random].author;

                    return new CustomMessage(response).success(resultResponse);
                }

                if (type === 'kanye') {
                    const url = 'https://api.kanye.rest/';
                    const result = await axios.get(url);
                    const resultTranslate = await translate(result.data.quote, { to: 'id' });
                    resultResponse.text_en = result.data.quote;
                    resultResponse.text_id = resultTranslate.text;
                    resultResponse.author = 'Kanye West';

                    return new CustomMessage(response).success(resultResponse);
                }

                if (type === 'agamis') {
                    const result = await fs.readFile(filePath.quotesAgamis, 'utf8');
                    const json = JSON.parse(result);
                    const random = Math.floor(Math.random() * json.length);
                    resultResponse.text_id = json[random];

                    return new CustomMessage(response).success(resultResponse);
                }
            }

            return new CustomMessage(response).error({
                status_code: 404,
                message: 'Type not found',
            }, 404);
        } catch (err) {
            return new CustomMessage(response).error({
                status_code: 500,
                message: err.message,
            }, 500);
        }
    }
}

module.exports = { QuoteController };
