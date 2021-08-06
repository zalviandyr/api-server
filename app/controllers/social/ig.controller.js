const puppeteer = require('puppeteer');
const { puppeteerValues } = require('helpers/values');
const { CustomMessage } = require('helpers/CustomMessage');

class IgController {
    constructor(req, res) {
        this.request = req;
        this.response = res;
    }

    async controller() {
        const { request, response } = this;
        const { url } = request.query;
        if (!url) {
            return new CustomMessage(response).error({
                status_code: 400,
                message: 'Silahkan masukkan query url',
            }, 400);
        }

        const urlGram = 'https://downloadgram.com/';
        const browser = await puppeteer.launch(puppeteerValues.options);
        try {
            const page = await browser.newPage();
            // user agent
            await page.setUserAgent(puppeteerValues.userAgent);

            await page.goto(urlGram);
            await page.type('input#dg-url', url);
            await page.click('input#dg-submit');
            await page.waitForSelector('div.success');
            const result = await page.$eval('div.success > a', (el) => el.getAttribute('href'));

            return new CustomMessage(response).success({ url: result }, 200, async () => { browser.close(); });
        } catch (err) {
            return new CustomMessage(response).error({
                status_code: 500,
                message: err.message,
            }, 500, async () => { browser.close(); });
        }
    }
}

module.exports = { IgController };
