const puppeteer = require('puppeteer')
const urlParse = require('url').parse
const { puppeteerValues } = require('helpers/values')
const { CustomMessage } = require('helpers/CustomMessage')

class MovieController {
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
                message: 'Silahkan isi query search, contoh: ?search=spiderman',
            }, 400)
        }

        const keyword = search.replace(/ /g, '+')
        const url = `https://terbit21.win/?s=${keyword}`

        const browser = await puppeteer.launch(puppeteerValues.options)
        try {
            const page = await browser.newPage()
            const downloadPage = await browser.newPage()

            // user agent
            await page.setUserAgent(puppeteerValues.userAgent)
            await downloadPage.setUserAgent(puppeteerValues.userAgent)

            await page.goto(url)

            const xpathSearchResult = '//div[@class="gsc-expansionArea"]'
            await page.waitForXPath(xpathSearchResult)
            const [elementsSearchResult] = await page.$x(xpathSearchResult)
            const urlFirstResult = await page.evaluate((element) => {
                // check if result exist
                const listSearch = element.querySelectorAll('div.gsc-webResult.gsc-result')
                let urlResult = null
                for (let i = 0; i < listSearch.length; i++) {
                    const noResult = listSearch[i].querySelector('div.gs-webResult.gs-result.gs-no-results-result')
                    if (noResult) {
                        return null
                    }

                    const urlSearchResult = listSearch[i].querySelector('div > div > div > a').getAttribute('href')
                    // cari yang benar" film, bukan tag, cast or page
                    if (!urlSearchResult.match(/\/([a-z]+)\//g)) {
                        urlResult = urlSearchResult
                        break
                    }
                }

                return urlResult
            }, elementsSearchResult)

            if (urlFirstResult) {
                // main page
                await page.goto(urlFirstResult)
                const xpathPost = '//article[@class="post"]'
                await page.waitForXPath(xpathPost)
                const [elementsPost] = await page.$x(xpathPost)
                const detailResult = await page.evaluate((element) => {
                    // pasti ada link yang awalnya '//', kagak tau kenapa dibuat begitu
                    const cleanUrl = (link) => {
                        if (link.startsWith('//')) {
                            return link.replace('//', 'http://')
                        }
                        return link
                    }

                    const content = element.querySelector('div.entry-content > div.row')
                    const title = (() => {
                        const temp = element.querySelectorAll('ol.breadcrumb > li')
                        return temp[temp.length - 1].querySelector('a').innerText
                    })()

                    const thumb = cleanUrl(content.querySelector('div:nth-child(1) > img').getAttribute('src'))
                    const genre = content.querySelector('div:nth-child(2) > table > tbody > tr:nth-child(1) > td').innerText
                    const actor = content.querySelector('div:nth-child(2) > table > tbody > tr:nth-child(2) > td').innerText
                    const director = content.querySelector('div:nth-child(2) > table > tbody > tr:nth-child(3) > td').innerText
                    const country = content.querySelector('div:nth-child(2) > table > tbody > tr:nth-child(4) > td').innerText
                    const quality = content.querySelector('div:nth-child(2) > table > tbody > tr:nth-child(5) > td').innerText
                    const imdb = content.querySelector('div:nth-child(2) > table > tbody > tr:nth-child(6) > td').innerText
                    const release = content.querySelector('div:nth-child(2) > table > tbody > tr:nth-child(7) > td').innerText
                    const duration = content.querySelector('div:nth-child(2) > table > tbody > tr:nth-child(8) > td').innerText
                    let synopsis = content.querySelector('div:nth-child(3) > div > p')
                    // check jika synopsis tidak ada
                    synopsis = (synopsis) ? synopsis.innerText : null

                    return {
                        thumb, title, genre, actor, director, country, quality, imdb, release, duration, synopsis,
                    }
                }, elementsPost)

                // download page
                const urlFirstResultParse = urlParse(urlFirstResult)
                const urlDownload = `https://terbit21.tv/get/?movie=${urlFirstResultParse.pathname.replace(/\//g, '')}`
                await downloadPage.goto(urlDownload)

                const urlDownloadFinal = await downloadPage.$eval('a#downloadbutton', (el) => el.getAttribute('href'))
                await downloadPage.goto(urlDownloadFinal, { waitUntil: 'domcontentloaded' })

                const xpathDownloadTable = '//div[@class="table-responsive"]'
                await downloadPage.waitForXPath(xpathDownloadTable)
                const [elementsDownloadTable] = await downloadPage.$x(xpathDownloadTable)
                const downloadResult = await downloadPage.evaluate((element) => {
                    // pasti ada link yang awalnya '//', kagak tau kenapa dibuat begitu
                    const cleanUrl = (link) => {
                        if (link.startsWith('//')) {
                            return link.replace('//', 'http://')
                        }
                        return link
                    }

                    const listDownloadAvailable = (() => {
                        const temp = []
                        const listTh = element.querySelectorAll('table > thead > tr:nth-child(2) > th')
                        for (let i = 0; i < listTh.length; i++) {
                            temp.push(listTh[i].innerText)
                        }
                        return temp
                    })()

                    const temp = []
                    const listTr = element.querySelectorAll('table > tbody > tr')
                    for (let i = 0; i < listTr.length; i++) {
                        const downloadLink = []
                        const provider = listTr[i].querySelector('td:nth-child(1)').innerText
                        const resolution = listTr[i].querySelector('td:nth-child(2)').innerText

                        const iterationDownloadAvailable = 2 + listDownloadAvailable.length
                        for (let j = 3; j <= iterationDownloadAvailable; j++) {
                            const title = listDownloadAvailable[j - 3]
                            let link = listTr[i].querySelector(`td:nth-child(${j}) > a`)
                            if (link) {
                                link = cleanUrl(link.getAttribute('href'))
                            }

                            downloadLink.push({ title, link })
                        }
                        temp.push({ provider, resolution, download_link: downloadLink })
                    }

                    const tempResult = { downloads: temp }
                    return tempResult
                }, elementsDownloadTable)

                return new CustomMessage(response).success(
                    Object.assign(detailResult, downloadResult),
                    200,
                    async () => { await browser.close() },
                )
            }

            return new CustomMessage(response).error({
                status_code: 404,
                message: 'Maaf, tidak hasil untuk mu',
            }, 404, async () => { await browser.close() })
        } catch (err) {
            return new CustomMessage(response).error({
                status_code: 500,
                message: err.message,
            }, 500, async () => { await browser.close() })
        }
    }
}

module.exports = { MovieController }
