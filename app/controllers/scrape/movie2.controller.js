const puppeteer = require('puppeteer')
const { puppeteerValues } = require('helpers/values')
const { CustomMessage } = require('helpers/CustomMessage')

class Movie2Controller {
    constructor(req, res) {
        this.request = req
        this.response = res
    }

    async controller() {
        const { request, response } = this
        let { search } = request.query

        if (!search) {
            return new CustomMessage(response).error({
                status_code: 400,
                message: 'Silahkan isi query search',
            }, 400)
        }

        search = search.replace(/ /g, '+')
        const url = `https://www.driverays.net/?s=${search}`
        const browser = await puppeteer.launch(puppeteerValues.options)

        try {
            const page = await browser.newPage()
            // user agent
            await page.setUserAgent(puppeteerValues.userAgent)

            await page.goto(url)

            const xpathSearchResult = '//div[@id="movies"]/div[2]'
            await page.waitForXPath(xpathSearchResult)
            const [elementsSearchResult] = await page.$x(xpathSearchResult)
            const resultFirstSearchUrl = await page.evaluate((element) => {
                const searchResults = element.querySelectorAll('div')
                if (searchResults.length === 0) return null
                return searchResults[0].querySelector('a').getAttribute('href')
            }, elementsSearchResult)

            if (resultFirstSearchUrl === null) {
                return new CustomMessage(response).error({
                    status_code: 404,
                    message: 'Maaf, tidak ada hasil untuk mu',
                }, 404, async () => { await browser.close() })
            }

            await page.goto(resultFirstSearchUrl)
            const xpathMainContent = '//div[@id="main-content"]'
            await page.waitForXPath(xpathMainContent)
            const [elementsMainContent] = await page.$x(xpathMainContent)
            const resultMainContent = await page.evaluate((element) => {
                const nullSafety = (elementSelected) => ((elementSelected) ? elementSelected.innerText : '')

                const thumb = element.querySelector('div.info_movie > div.posthumb > img').getAttribute('src')
                // score and quality
                const scoreQuality = (() => {
                    const temp = element.querySelectorAll('div.tpost > div.backdrop > div.absolute > span')
                    return {
                        score: nullSafety(temp[0]),
                        quality: nullSafety(temp[1]),
                    }
                })()
                const title = nullSafety(element.querySelector('div.info_movie > div.postdetail > h1'))
                const year = nullSafety(element.querySelector('div.info_movie > div.postdetail > div.thn > div:nth-child(1)'))
                const country = nullSafety(element.querySelector('div.info_movie > div.postdetail > div.thn > div:nth-child(2)'))
                const duration = nullSafety(element.querySelector('div.info_movie > div.postdetail > div.thn > div:nth-child(3)'))
                const director = nullSafety(element.querySelector('div.info_movie > div.postdetail > div.info > p:nth-child(1) > a'))
                const rating = nullSafety(element.querySelector('div.info_movie > div.postdetail > div.info > p:nth-child(2)')).split(':')[1].trim()
                const genre = nullSafety(element.querySelector('div.info_movie > div.postdetail > div.info > p:nth-child(3)')).replace(/ /g, ', ')
                const synopsis = nullSafety(element.querySelector('div#tab-1 > p'))
                const trailer = element.querySelector('div#tab-2 > div.player-embed > iframe').getAttribute('src')
                const downloads = (() => {
                    const tempDownloads = []
                    const tbodyDownload = element.querySelectorAll('div > table.download > tbody >tr:not(.ini)')
                    for (let i = 0; i < tbodyDownload.length; i++) {
                        const server = nullSafety(tbodyDownload[i].querySelector('td:nth-child(1)'))
                        const description = nullSafety(tbodyDownload[i].querySelector('td:nth-child(2) > a'))
                        const link = tbodyDownload[i].querySelector('td:nth-child(2) > a').getAttribute('href')
                        const size = nullSafety(tbodyDownload[i].querySelector('td:nth-child(3)'))

                        tempDownloads.push({
                            server, description, link, size,
                        })
                    }
                    return tempDownloads
                })()

                return {
                    thumb,
                    score: scoreQuality.score,
                    quality: scoreQuality.quality,
                    title,
                    year,
                    country,
                    duration,
                    director,
                    rating,
                    genre,
                    synopsis,
                    trailer,
                    downloads,
                }
            }, elementsMainContent)

            return new CustomMessage(response).success(resultMainContent, 200, async () => { await browser.close() })
        } catch (err) {
            return new CustomMessage(response).error({
                status_code: 500,
                message: err.message,
            }, 500, async () => { await browser.close() })
        }
    }
}

module.exports = { Movie2Controller }
