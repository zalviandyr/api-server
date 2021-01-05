const { CustomMessage } = require('helpers/CustomMessage')
const { puppeteerValues } = require('helpers/values')
const puppeteer = require('puppeteer')

class YtAudioController {
    constructor(req, res) {
        this.request = req
        this.response = res
    }

    async controller() {
        const { request, response } = this
        const { url } = request.query
        if (!url) {
            return new CustomMessage(response).error({
                status_code: 400,
                message: 'Silahkan isi query url',
            }, 400)
        }

        const urlY2Mate = 'https://www.y2mate.com/en5/download-youtube'
        const browser = await puppeteer.launch(puppeteerValues.options)
        try {
            const page = await browser.newPage()
            // user agent
            await page.setUserAgent(puppeteerValues.userAgent)

            await page.goto(urlY2Mate)

            // input youtube url
            await page.type('input.form-control.input-lg', url)
            await page.click('button.btn.btn-lg')

            await page.waitForXPath('//div[@class="caption text-left"]')
            const [elementsTitle] = await page.$x('//div[@class="caption text-left"]')
            const title = await elementsTitle.$eval('b', (el) => el.innerText)
            const duration = await elementsTitle.$eval('p', (el) => el.innerText.split(' ')[1])

            await page.waitForXPath('//div[@class="tab-pane fade"][@id="mp3"]')
            const [elementsMp3] = await page.$x('//div[@class="tab-pane fade"][@id="mp3"]')
            const size = await elementsMp3.$eval('table > tbody > tr:nth-child(1) > td:nth-child(2)', (el) => el.innerText)
            await elementsMp3.$eval('table > tbody > tr:nth-child(1) > td:nth-child(3) > a', (el) => el.click())

            await page.waitForXPath('//div[@class="form-group has-success has-feedback"]', { visible: true })
            const [elements] = await page.$x('//div[@class="form-group has-success has-feedback"]')
            const urlResult = await page.evaluate((element) => element.querySelector('a').getAttribute('href'), elements)

            return new CustomMessage(response).success({
                title,
                size,
                duration,
                ext: 'mp3',
                url: urlResult,
            }, 200, async () => {
                browser.close()
            })
        } catch (err) {
            return new CustomMessage(response).error({
                status_code: 500,
                message: err.message,
            }, 500, async () => {
                browser.close()
            })
        }
    }
}

module.exports = { YtAudioController }
