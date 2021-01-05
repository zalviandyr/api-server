const puppeteer = require('puppeteer')
const { puppeteerValues } = require('helpers/values')
const { CustomMessage } = require('helpers/CustomMessage')

class YtVideoController {
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

            const xpathMP4 = '//div[@class="tab-pane fade active in"][@id="mp4"]'
            await page.waitForXPath(xpathMP4)
            const [elementsMp4] = await page.$x(xpathMP4)
            const result = await page.evaluate((elements) => {
                const listDownResolution = elements.querySelectorAll('table > tbody > tr')
                for (let i = 0; i < listDownResolution.length; i++) {
                    // get 360p resolution
                    const listResolution = listDownResolution[i].querySelector('td:nth-child(1) > a').innerText.split(' ')[0]
                    if (listResolution === '360p') {
                        const resolution = listResolution
                        const size = listDownResolution[i].querySelector('td:nth-child(2)').innerText
                        const downloadButton = listDownResolution[i].querySelector('td:nth-child(3) > a')
                        downloadButton.click()

                        return { resolution, size }
                    }
                }
                return null
            }, elementsMp4)

            await page.waitForXPath('//div[@class="form-group has-success has-feedback"]', { visible: true })
            const [elements] = await page.$x('//div[@class="form-group has-success has-feedback"]')
            const urlResult = await page.evaluate((element) => element.querySelector('a').getAttribute('href'), elements)

            return new CustomMessage(response).success({
                title,
                res: result.resolution,
                size: result.size,
                duration,
                ext: 'mp4',
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

module.exports = { YtVideoController }
