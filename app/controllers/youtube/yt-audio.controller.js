const { CustomMessage } = require('helpers/CustomMessage');
const { puppeteerValues } = require('helpers/values');
const puppeteer = require('puppeteer');

class YtAudioController {
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
                message: 'Silahkan isi query url',
            }, 400);
        }

        const urlYt1s = 'https://yt1s.com';
        const browser = await puppeteer.launch(puppeteerValues.options);
        try {
            const page = await browser.newPage();
            // user agent
            await page.setUserAgent(puppeteerValues.userAgent);
            await page.goto(urlYt1s);

            // input url youtube
            await page.waitForSelector('#s_input');
            const input = await page.$('#s_input');
            await input.type(url);

            // convert
            await page.waitForSelector('.btn-red');
            const convert = await page.$('.btn-red');
            await convert.click();

            // select mp3 and get size
            await page.waitForSelector('[label="mp3"]');
            const size = await page.$eval('[label="mp3"]', (el) => {
                let result = '';
                const options = el.querySelectorAll('option');

                options[0].selected = true;
                const text = options[0].textContent;
                const array = text.split('(')[1];
                result = array.replace(')', '').trim();

                return result;
            });

            // get link
            await page.waitForSelector('#btn-action');
            const getLinkBtn = await page.$('#btn-action');
            await getLinkBtn.click();

            // get link download
            await page.waitForSelector('#asuccess', { visible: true });
            const downloadLink = await page.$eval('#asuccess', (el) => el.getAttribute('href'));

            // get title
            const title = await page.$eval('.clearfix > h3', (el) => el.textContent);

            // get duration
            const duration = await page.$eval('.clearfix > .mag0', (el) => el.textContent);

            return new CustomMessage(response).success({
                title,
                size,
                duration,
                ext: 'mp3',
                url: downloadLink,
            }, 200, async () => {
                browser.close();
            });
        } catch (err) {
            return new CustomMessage(response).error({
                status_code: 500,
                message: err.message,
            }, 500, async () => {
                browser.close();
            });
        }
    }
}

module.exports = { YtAudioController };
