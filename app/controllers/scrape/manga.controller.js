const puppeteer = require('puppeteer')
const urlParse = require('url').parse
const { CustomMessage } = require('helpers/CustomMessage')
const { puppeteerValues } = require('helpers/values')

class MangaController {
    constructor(req, res) {
        this.request = req
        this.response = res
    }

    async controller() {
        const { request, response } = this
        let { keyword } = request.query
        if (!keyword) {
            return new CustomMessage(response).error({
                status_code: 400,
                message: 'Silahkan isi query keyword, contoh ?keyword=kimetsu no yaiba',
            }, 400)
        }

        keyword = keyword.replace(/ /g, '+')
        const url = `https://www.meganebuk.net/?s=${keyword}`
        const browser = await puppeteer.launch(puppeteerValues.options)
        try {
            const page = await browser.newPage()

            // user agent
            await page.setUserAgent(puppeteerValues.userAgent)

            await page.goto(url, { waitUntil: 'domcontentloaded' })

            const xpathSearchResult = '//main[@id="main"][@class="site-main"]'
            await page.waitForXPath(xpathSearchResult)
            const [elementsSearchResult] = await page.$x(xpathSearchResult)
            const resultFirstUrl = await page.evaluate((element) => {
                const noResult = element.querySelector('section.no-results.not-found')
                if (noResult) return null

                const allResult = element.querySelectorAll('article')
                return allResult[0].querySelector('a').getAttribute('href')
            }, elementsSearchResult)

            if (resultFirstUrl === null) {
                return new CustomMessage(response).error({
                    status_code: 404,
                    message: 'Maaf, tidak hasil untuk mu',
                }, 404, async () => { await browser.close() })
            }

            await page.goto(resultFirstUrl, { waitUntil: 'networkidle0' })

            const xpathIntro = '//div[@class="entry-content clearfix"]'
            await page.waitForXPath(xpathIntro)
            const [elementsIntro] = await page.$x(xpathIntro)
            const resultIntro = await page.evaluate((element) => {
                const note = document.querySelector('#main > div:nth-child(1)').innerText
                const thumb = (() => {
                    const thumb1 = element.querySelector('div:nth-child(2) > table > tbody > tr:nth-child(1) > td > a')
                    const thumb2 = element.querySelector('div:nth-child(2) > table > tbody > tr:nth-child(1) > td > img')
                    if (thumb1) return thumb1.getAttribute('href')
                    if (thumb2) return thumb2.getAttribute('src')
                    return ''
                })()
                const title = element.querySelector('div:nth-child(2) > table > tbody > tr:nth-child(2) > td').innerText
                const description = element.querySelector('div:nth-child(1)').innerText

                return {
                    note, thumb, title, description,
                }
            }, elementsIntro)

            const xpathDescription = '//div[@class="entry-content clearfix"]/table[1]'
            await page.waitForXPath(xpathDescription)
            const [elementsDescription] = await page.$x(xpathDescription)
            const resultDescription = await page.evaluate((element) => {
                const name = element.querySelector('tbody > tr:nth-child(2) > td:nth-child(2)').innerText
                const type = element.querySelector('tbody > tr:nth-child(3) > td:nth-child(2)').innerText
                const author = element.querySelector('tbody > tr:nth-child(4) > td:nth-child(2)').innerText
                const genre = element.querySelector('tbody > tr:nth-child(5) > td:nth-child(2)').innerText
                const rating = element.querySelector('tbody > tr:nth-child(6) > td:nth-child(2)').innerText
                const released = element.querySelector('tbody > tr:nth-child(7) > td:nth-child(2)').innerText
                const status = element.querySelector('tbody > tr:nth-child(8) > td:nth-child(2)').innerText

                return {
                    name, type, author, genre, rating, released, status,
                }
            }, elementsDescription)

            const xpathDownloads = '//div[@class="entry-content clearfix"]/table[2]'
            await page.waitForXPath(xpathDownloads)
            const [elementsDownloads] = await page.$x(xpathDownloads)
            const resultDownloads = await page.evaluate((element) => {
                const tempDownloads = []
                const allTr = element.querySelectorAll('tbody > tr')
                let index = 0
                for (let i = 0; i < allTr.length; i++) {
                    const separateDownload = allTr[i].querySelector('td').hasAttribute('bgcolor')
                    if (separateDownload) {
                        index = i
                        break
                    }
                }

                // artinya ada tempat download terpisah, seperti one piece
                if (index !== 0) {
                    for (let i = (index + 1); i < allTr.length; i++) {
                        const date = allTr[i].querySelector('td > b').innerText
                        const title = allTr[i].querySelector('td > a').innerText
                        const link = allTr[i].querySelector('td > a').getAttribute('href')
                        tempDownloads.push({ date, title, link })
                    }
                }

                if (index === 0) {
                    for (let i = (index + 1); i < allTr.length; i++) {
                        const countTd = allTr[i].querySelectorAll('td')
                        if (countTd.length === 2) {
                            const date = ''
                            const title = allTr[i].querySelector('td:nth-child(1)').innerText
                            const link = allTr[i].querySelector('td:nth-child(2) > a:nth-child(2)').getAttribute('href')
                            tempDownloads.push({ date, title, link })
                        }

                        if (countTd.length === 3) {
                            const date = allTr[i].querySelector('td:nth-child(1)').innerText
                            const title = allTr[i].querySelector('td:nth-child(2)').innerText
                            const link = allTr[i].querySelector('td:nth-child(3) > a:nth-child(2)').getAttribute('href')
                            tempDownloads.push({ date, title, link })
                        }
                    }
                }
                return { downloads: tempDownloads }
            }, elementsDownloads)

            for (let i = 0; i < resultDownloads.downloads.length; i++) {
                const queryData = urlParse(resultDownloads.downloads[i].link, { parseQueryString: true }).query

                // jika query.s ada maka pakai itu
                // jika tidak ada maka pakai saja yang belum diparsing
                if (queryData.s) {
                    resultDownloads.downloads[i].link = queryData.s
                }
            }

            return new CustomMessage(response).success(
                Object.assign(resultIntro, resultDescription, resultDownloads),
                200,
                async () => { await browser.close() },
            )
        } catch (err) {
            return new CustomMessage(response).error({
                status_code: 500,
                message: err.message,
            }, 500, async () => { await browser.close() })
        }
    }
}

module.exports = { MangaController }
