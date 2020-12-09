const puppeteer = require('puppeteer')
const { puppeteerValues } = require('helpers/values')
const { CustomMessage } = require('helpers/CustomMessage')

class TiktokController {
    constructor(req, res) {
        this.request = req
        this.response = res
    }

    async controller() {
        const { request, response } = this
        const { url } = request.query
        const urlDownloader = 'https://snaptik.app/ID'

        if (!url) {
            return new CustomMessage(response).error({
                status_code: 400,
                message: 'Silahkan isi query url',
            }, 400)
        }

        const browser = await puppeteer.launch(puppeteerValues.options)
        try {
            const page = await browser.newPage()

            // user agent
            await page.setUserAgent(puppeteerValues.userAgent)

            await page.goto(urlDownloader)
            await page.type('input#url', url)
            await page.click('button[type="submit"]')

            const xpathDownload = '//div[@id="div_download"]/section/div[@class="container"]/div/div'
            await page.waitForXPath(xpathDownload)
            const [elementsDownload] = await page.$x(xpathDownload)
            const result = await page.evaluate((element) => {
                const thumb = element.querySelector('article > div.zhay-left > img').getAttribute('src')
                const title = element.querySelector('article > div.zhay-middle > h1').innerText
                const description = element.querySelector('article > div.zhay-middle > p:nth-child(2)').innerText
                const date = element.querySelector('article > div.zhay-middle > p:nth-child(3)').innerText
                const downloads = (() => {
                    const temp = []
                    const aList = element.querySelectorAll('article > div.zhay-right > div > a')
                    for (let i = 0; i < aList.length; i++) {
                        const link = aList[i].getAttribute('href')

                        temp.push(link)
                    }
                    return temp
                })()

                return {
                    thumb, title, description, date, downloads,
                }
            }, elementsDownload)

            return new CustomMessage(response).success(result, 200, async () => { await browser.close() })
        } catch (err) {
            return new CustomMessage(response).error({
                status_code: 500,
                message: err.message,
            }, 500, async () => { await browser.close() })
        }
    }
}

module.exports = { TiktokController }
