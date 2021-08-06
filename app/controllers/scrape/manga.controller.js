const axios = require('axios');
const cheerio = require('cheerio');
const { CustomMessage } = require('helpers/CustomMessage');

class MangaController {
    constructor(req, res) {
        this.request = req;
        this.response = res;
    }

    async controller() {
        const { request, response } = this;
        let { keyword } = request.query;
        if (!keyword) {
            return new CustomMessage(response).error({
                status_code: 400,
                message: 'Silahkan isi query keyword, contoh ?keyword=kimetsu no yaiba',
            }, 400);
        }

        keyword = keyword.replace(/ /g, '+');
        const url = `https://www.meganebuk.net/?s=${keyword}`;

        try {
            // search page
            const responseSearch = await axios.get(url);
            const selectorSearch = cheerio.load(responseSearch.data);
            const searchResult = selectorSearch('#main > article');
            const firstResultUrl = searchResult.first().children('a').attr('href');
            if (searchResult.length === 0) {
                return new CustomMessage(response).error({
                    status_code: 404,
                    message: 'Maaf, tidak ada hasil untuk mu',
                }, 404);
            }

            // content page
            const responseContent = await axios.get(firstResultUrl);
            const selectorContent = cheerio.load(responseContent.data);
            const root = selectorContent('#content > #primary > #main');
            const rootDetail = selectorContent(root.find('div.entry-content > table').get(0)).find('tbody > tr');
            const rootDownload = selectorContent(root.find('div.entry-content > table').get(1)).find('tbody > tr');
            const rootDownload2 = root.find('div.aligncenter');

            const resultResponse = {};
            resultResponse.note = root.children('div').first().text();
            resultResponse.thumb = (() => {
                const temp = root.find('img.lazyload').attr('data-src');

                return temp;
            })();

            resultResponse.title = root.find('td.tr-caption').text();
            resultResponse.description = root.find('div.entry-content > div[style="text-align: justify;"]')
                .map((i, elm) => selectorContent(elm).text())
                .get();

            // info
            const getInfo = (info) => rootDetail.filter((i, elm) => selectorContent(elm).find('td > b').text() === info)
                .children('td')
                .last()
                .text();

            resultResponse.name = getInfo('Name');
            resultResponse.type = getInfo('Type');
            resultResponse.author = getInfo('Author');
            resultResponse.genre = getInfo('Genre');
            resultResponse.rating = getInfo('Rating');
            resultResponse.released = getInfo('Released');
            resultResponse.status = getInfo('Status');

            resultResponse.downloads = (() => {
                let index = 0;
                let lastIndex = 0;
                const temp = [];

                index = rootDownload.children('td[bgcolor]').parent().index();
                lastIndex = rootDownload.last().index();

                // jika ada table
                if (rootDownload.length !== 0) {
                    // artinya ada tempat download terpisah, seperti one piece
                    if (index === -1) index += 1;

                    rootDownload.slice((index + 1), (lastIndex + 1))
                        // filter jika ada note di tengah" tempat download
                        .filter((i, elm) => selectorContent(elm).children('td:not(colspan)').length !== 1)
                        .each((i, elm) => {
                            const td = selectorContent(elm).children('td');
                            const date = td.children(':not(a)').text();
                            const title = td.children('a').first().text();
                            const link = td.children('a').first().attr('href');
                            temp.push({ date, title, link });
                        });
                } else {
                    rootDownload2.each((i, elm) => {
                        const date = selectorContent(elm).children(':not(a)').text();
                        const title = selectorContent(elm).children('a').first().text();
                        const link = selectorContent(elm).children('a').first().attr('href');
                        temp.push({ date, title, link });
                    });
                }

                return temp;
            })();

            return new CustomMessage(response).success(resultResponse);
        } catch (err) {
            return new CustomMessage(response).error({
                status_code: 500,
                message: err.message,
            }, 500);
        }
    }
}

module.exports = { MangaController };
