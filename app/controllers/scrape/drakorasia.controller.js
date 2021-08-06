const axios = require('axios');
const cheerio = require('cheerio');
const { shortTitleDrakorasia } = require('helpers/values');
const { CustomMessage } = require('helpers/CustomMessage');

class DrakorasiaController {
    constructor(req, res) {
        this.request = req;
        this.response = res;
    }

    async controller() {
        const { request, response } = this;
        const { search } = request.query;

        if (!search) {
            return new CustomMessage(response).error({
                status_code: 400,
                message: 'Silahkan isi query search, contoh ?search=tale',
            }, 400);
        }

        const keyword = search.replace(/ /g, '+');
        const url = `https://drakorasia.cc/?s=${keyword}&post_type=post`;

        try {
            // search page
            const responseSearch = await axios.get(url);
            const selectorSearch = cheerio.load(responseSearch.data);
            const searchResult = selectorSearch('#latest > .grid');
            const firstSearchUrl = searchResult.find('#post > .cover > .thumbnail > a').attr('href');
            if (firstSearchUrl === undefined) {
                return new CustomMessage(response).error({
                    status_code: 404,
                    message: 'Maaf, tidak ada hasil untuk mu',
                }, 404);
            }

            // content page
            const responseContent = await axios.get(firstSearchUrl);
            const selectorContent = cheerio.load(responseContent.data);
            // const rootHeader = selectorContent('div[class="if-ct"] > div[class="inf"] > div[class="container"]')
            const rootHeader = selectorContent('#info_drama');
            const rootDownload = selectorContent('#content-post > table');

            const resultResponse = {};
            resultResponse.thumb = rootHeader.find('.thumbnail > img').attr('src');
            resultResponse.title = rootHeader.find('.detail > h2').text();
            resultResponse.titleKr = rootHeader.find('.detail > p')
                .first().text().split('/')[0].trim();
            resultResponse.year = rootHeader.find('.detail > p')
                .first().text().split('/')[1].trim();
            resultResponse.episode = rootHeader.find('.detail > p')
                .first().text().split('/')[2].trim();
            resultResponse.genre = rootHeader.find('.detail > .gens')
                .text().trim().replace(/ /g, ', ');
            resultResponse.duration = rootHeader.find('.detail > .durs > span')
                .text().trim();
            resultResponse.network = rootHeader.find('.detail > .durs > a')
                .text().trim();
            resultResponse.synopsis = selectorContent('#synopsis > p').text().trim();

            // casters
            const tempCasters = [];
            rootHeader.find('.detail > .casts > p > a')
                .each((i, elm) => { tempCasters.push(selectorContent(elm).text()); });
            resultResponse.casters = tempCasters.join(', ');

            // episodes
            resultResponse.episodes = [];
            const availableResolution = [];
            rootDownload.find('thead > tr > th')
                .each((i, elm) => {
                    if (i > 0) availableResolution.push(selectorContent(elm).text().split(' ')[1]);
                });

            rootDownload.find('tbody > tr')
                .each((i, elm) => {
                    const downloads = [];
                    const episode = selectorContent(elm).children('td').first().text();

                    // tidak mengambil episode, hanya download link
                    for (let j = 1; j <= availableResolution.length; j++) {
                        const downloadLink = [];
                        const resolution = availableResolution[j - 1];

                        // link download
                        selectorContent(
                            selectorContent(elm).children('td').get(j),
                        ).children('a').each((iA, elmA) => {
                            let title = selectorContent(elmA).text();
                            const link = selectorContent(elmA).attr('href');

                            shortTitleDrakorasia.forEach((val) => {
                                if (val.shortName === title) title = val.name;
                            });
                            downloadLink.push({ title, link });
                        });
                        // const server = selectorContent(elm).children('td').children('a').text()
                        downloads.push({ resolution, download_link: downloadLink });
                    }
                    resultResponse.episodes.push({ episode, downloads });
                });

            return new CustomMessage(response).success(resultResponse);
        } catch (err) {
            return new CustomMessage(response).error({
                status_code: 500,
                message: err.message,
            }, 500);
        }
    }
}

module.exports = { DrakorasiaController };
