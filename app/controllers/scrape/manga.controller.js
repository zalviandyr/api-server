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

            const xpathThumb = '//img[@class=" lazyloaded"]'
            await page.waitForXPath(xpathThumb)
            const [elementsThumb] = await page.$x(xpathThumb)
            const resultThumb = await page.evaluate((element) => element.getAttribute('src'), elementsThumb)

            const xpathTitle = '//td[@class="tr-caption"]'
            await page.waitForXPath(xpathTitle)
            const [elementsTitle] = await page.$x(xpathTitle)
            const resultTitle = await page.evaluate((element) => element.innerText, elementsTitle)

            const xpathIntro = '//div[@class="entry-content clearfix"]'
            await page.waitForXPath(xpathIntro)
            const [elementsIntro] = await page.$x(xpathIntro)
            const resultIntro = await page.evaluate((element, thumb, title) => {
                const note = document.querySelector('#main > div:nth-child(1)').innerText
                const description = element.querySelector('div:nth-child(1)').innerText

                return {
                    note, thumb, title, description,
                }
            }, elementsIntro, resultThumb, resultTitle)

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
            const xpathDownloads2 = '//div[@class="entry-content clearfix"]'
            const [checkTableExist] = await page.$x(xpathDownloads)
            let resultDownloads
            if (checkTableExist) {
                await page.waitForXPath(xpathDownloads)
                const [elementsDownloads] = await page.$x(xpathDownloads)
                resultDownloads = await page.evaluate((element) => {
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
                        const getLink = (node) => {
                            const countA = node.querySelectorAll('a')
                            if (countA.length === 1) return countA[0].getAttribute('href')
                            if (countA.length === 2) return countA[1].getAttribute('href')
                            return ''
                        }

                        for (let i = (index + 1); i < allTr.length; i++) {
                            const countTd = allTr[i].querySelectorAll('td')
                            if (countTd.length === 2) {
                                const date = ''
                                const title = allTr[i].querySelector('td:nth-child(1)').innerText
                                const link = getLink(allTr[i].querySelector('td:nth-child(2)'))
                                tempDownloads.push({ date, title, link })
                            }

                            if (countTd.length === 3) {
                                const date = allTr[i].querySelector('td:nth-child(1)').innerText
                                const title = allTr[i].querySelector('td:nth-child(2)').innerText
                                const link = getLink(allTr[i].querySelector('td:nth-child(3)'))
                                tempDownloads.push({ date, title, link })
                            }
                        }
                    }
                    return { downloads: tempDownloads }
                }, elementsDownloads)
            } else {
                await page.waitForXPath(xpathDownloads2)
                const [elementsDownloads2] = await page.$x(xpathDownloads2)
                resultDownloads = await page.evaluate((element) => {
                    const getLink = (node) => {
                        const countA = node.querySelectorAll('a')
                        if (countA.length === 1) return countA[0].getAttribute('href')
                        if (countA.length === 2) return countA[1].getAttribute('href')
                        return ''
                    }

                    const downloads = element.querySelectorAll('div.aligncenter')
                    const tempDownloads = []

                    for (let i = 0; i < downloads.length; i++) {
                        const date = ''
                        const title = downloads[i].querySelector('strong').innerText
                        const link = getLink(downloads[i])
                        tempDownloads.push({ date, title, link })
                    }

                    return { downloads: tempDownloads }
                }, elementsDownloads2)
            }

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
