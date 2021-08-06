const axios = require('axios');
const cheerio = require('cheerio');
const { CustomMessage } = require('helpers/CustomMessage');

class WikipediaController {
    constructor(req, res) {
        this.request = req;
        this.response = res;
    }

    async controller() {
        const { request, response } = this;
        const { keyword } = request.query;

        if (!keyword) {
            return new CustomMessage(response).error({
                status_code: 400,
                message: 'Silahkan isi query keyword',
            }, 400);
        }

        try {
            const url = `https://id.wikipedia.org/wiki/${keyword}`;
            const { data } = await axios.get(url);
            const selector = cheerio.load(data);
            const result = selector('div[class="mw-parser-output"]');
            const title = selector('h1[id="firstHeading"]');

            const paragraph = result.find('div[id="toc"]').prevUntil('table, div');
            const textArray = paragraph.text().split('\n').reverse().filter((el) => el !== '');
            const textClean = textArray.map((el) => el.replace(/\[([0-9]+)\]/g, ''));

            const resultResponse = { title: title.text(), result: textClean };
            return new CustomMessage(response).success(resultResponse);
        } catch (err) {
            if (err.response.status === 404) {
                return new CustomMessage(response).error({
                    status_code: 404,
                    message: 'Maaf, tidak ada hasil untuk mu',
                }, 404);
            }

            return new CustomMessage(response).error({
                status_code: 500,
                message: err.message,
            }, 500);
        }
    }
}

module.exports = { WikipediaController };
