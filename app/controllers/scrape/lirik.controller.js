const puppeteer = require('puppeteer')
const { puppeteerValues } = require('helpers/values')
const { CustomMessage } = require('helpers/CustomMessage')

class LirikController {
    constructor(req, res) {
        this.request = req
        this.response = res
    }

    async controller() {
        const { request, response } = this
        const { search } = request.query

        if (!search) {
            return new CustomMessage(response).error({
                status_code: 400,
                message: 'Silahkan isi query search, contoh ?search=mitis moments',
            }, 400)
        }

        const keyword = search.replace(/ /g, '+')
        const url = `https://lirik.web.id/results/?q=${keyword}`

        const browser = await puppeteer.launch(puppeteerValues.options)

        try {
            const page = await browser.newPage()
            await page.setUserAgent(puppeteerValues.userAgent)

            await page.goto(url)

            const xpathResult = '//div[@id="siteloader"]'
            await page.waitForXPath(xpathResult)
            const [elementsResult] = await page.$x(xpathResult)
            const firstResultUrl = await page.evaluate((element) => {
                const searchResult = element.querySelectorAll('p')
                if (searchResult.length === 0) {
                    return null
                }
                // return first result
                return searchResult[0].querySelector('a').getAttribute('href')
            }, elementsResult)

            if (firstResultUrl) {
                await page.goto(firstResultUrl)

                const xpathMainContent = '//div[@class="entry-content"]'
                await page.waitForXPath(xpathMainContent)
                const [elementsMainContent] = await page.$x(xpathMainContent)
                const mainContentResult = await page.evaluate((element) => {
                    const lyricParagraph = element.querySelectorAll('p')
                    const title = element.querySelector('h1.entry-title').innerText

                    const temp = []
                    // minus 1, because no need last element
                    for (let i = 0; i < (lyricParagraph.length - 1); i++) {
                        temp.push(lyricParagraph[i].innerText)
                    }

                    return { title, lyric: temp }
                }, elementsMainContent)

                return new CustomMessage(response).success(mainContentResult, 200, async () => { browser.close() })
            }

            return new CustomMessage(response).error({
                status_code: 404,
                message: 'Maaf, tidak ada hasil untuk mu',
            }, 404, async () => { browser.close() })
        } catch (err) {
            return new CustomMessage(response).error({
                status_code: 500,
                message: err.message,
            }, 500, async () => { browser.close() })
        }
    }
}

module.exports = { LirikController }
