const axios = require('axios')
const cheerio = require('cheerio')
const puppeteer = require('puppeteer')
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
        const url = `http://185.63.253.222/?s=${keyword}`

        const browser = await puppeteer.launch(puppeteerValues.options)

        try {
            const downloadPage = await browser.newPage()
            // user agent
            await downloadPage.setUserAgent(puppeteerValues.userAgent)

            // search page
            const responseSearch = await axios.get(url)
            const selectorSearch = cheerio.load(responseSearch.data)
            const searchResult = selectorSearch('div.grid.row > div')
            const firstSearchUrl = searchResult.first().find('div.thumbnail > a').attr('href')
            if (searchResult.length === 0) {
                return new CustomMessage(response).error({
                    status_code: 404,
                    message: 'Maaf, tidak ada hasil untuk mu',
                }, 404)
            }

            // content page
            const responseContent = await axios.get(firstSearchUrl)
            const selectorContent = cheerio.load(responseContent.data)
            const root = selectorContent('div.entry-content')
            const downloadUrl = selectorContent('div.download-movie > a').first().attr('href')

            const resultResponse = {}
            resultResponse.thumb = root.find('div.col-md-3 > img').attr('src')
            resultResponse.title = root.find('div.col-md-3 > img').attr('title')
            resultResponse.genre = root.find('div.col-md-12 > table > tbody > tr')
                .filter((i, elm) => selectorContent(elm).children('th').text() === 'Genre')
                .children('td').text()
            resultResponse.actor = root.find('div.col-md-12 > table > tbody > tr')
                .filter((i, elm) => selectorContent(elm).children('th').text() === 'Actor')
                .children('td').text()
            resultResponse.director = root.find('div.col-md-12 > table > tbody > tr')
                .filter((i, elm) => selectorContent(elm).children('th').text() === 'Director')
                .children('td').text()
            resultResponse.country = root.find('div.col-md-12 > table > tbody > tr')
                .filter((i, elm) => selectorContent(elm).children('th').text() === 'Country')
                .children('td').text()
            resultResponse.quality = root.find('div.col-md-12 > table > tbody > tr')
                .filter((i, elm) => selectorContent(elm).children('th').text() === 'Quality')
                .children('td').text()
            resultResponse.imdb = root.find('div.col-md-12 > table > tbody > tr')
                .filter((i, elm) => selectorContent(elm).children('th').text() === 'IMDb')
                .children('td').text()
            resultResponse.release = root.find('div.col-md-12 > table > tbody > tr')
                .filter((i, elm) => selectorContent(elm).children('th').text() === 'Release')
                .children('td').text()
            resultResponse.duration = root.find('div.col-md-12 > table > tbody > tr')
                .filter((i, elm) => selectorContent(elm).children('th').text() === 'Duration')
                .children('td').text()
            resultResponse.synopsis = root.find('div#movie-synopsis > div > p').text()

            // download page
            await downloadPage.goto(downloadUrl, { waitUntil: 'domcontentloaded' })

            const xpathDownloadTable = '//div[@class="table-responsive"]'
            await downloadPage.waitForXPath(xpathDownloadTable)
            const [elementsDownloadTable] = await downloadPage.$x(xpathDownloadTable)
            resultResponse.downloads = await downloadPage.evaluate((element) => {
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

                return temp
            }, elementsDownloadTable)

            return new CustomMessage(response).success(
                resultResponse,
                200,
                async () => { browser.close() },
            )
        } catch (err) {
            return new CustomMessage(response).error({
                status_code: 500,
                message: err.message,
            }, 500, async () => { browser.close() })
        }
    }
}

module.exports = { MovieController }
