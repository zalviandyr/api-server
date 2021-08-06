const puppeteer = require('puppeteer');
const { puppeteerValues } = require('helpers/values');
const { CustomMessage } = require('helpers/CustomMessage');

class TiktokController {
    constructor(req, res) {
        this.request = req;
        this.response = res;
    }

    async controller() {
        const { request, response } = this;
        const { url } = request.query;
        const urlDownloader = 'https://snaptik.app/ID';

        if (!url) {
            return new CustomMessage(response).error({
                status_code: 400,
                message: 'Silahkan isi query url',
            }, 400);
        }

        const browser = await puppeteer.launch(puppeteerValues.options);
        try {
            const page = await browser.newPage();

            // user agent
            await page.setUserAgent(puppeteerValues.userAgent);

            await page.goto(urlDownloader);
            await page.waitForSelector('input#url');
            await page.type('input#url', url);
            await page.click('button[type="submit"]');

            const downloadSelector = '#download-block > div > a';
            await page.waitForSelector(downloadSelector);
            const thumb = await page.$eval('.snaptik-left > img', (pageEval) => pageEval.getAttribute('src'));
            const title = await page.$eval('.snaptik-middle > h3', (pageEval) => pageEval.textContent);
            const description = await page.$eval('.snaptik-middle > p > span', (pageEval) => pageEval.textContent);
            const download = await page.$$eval(downloadSelector, (pageEval) => {
                const downloads = [];
                for (let i = 0; i < pageEval.length; i++) {
                    downloads.push(pageEval[i].getAttribute('href'));
                }
                return downloads;
            });

            const result = {
                thumb, title, description, download,
            };

            return new CustomMessage(response).success(result, 200, async () => { browser.close(); });
        } catch (err) {
            return new CustomMessage(response).error({
                status_code: 500,
                message: err.message,
            }, 500, async () => { browser.close(); });
        }
    }
}

module.exports = { TiktokController };
