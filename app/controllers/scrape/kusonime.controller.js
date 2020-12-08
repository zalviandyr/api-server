const puppeteer = require('puppeteer')
const urlParse = require('url').parse
const { CustomMessage } = require('helpers/CustomMessage')
const { puppeteerValues } = require('helpers/values')

class KusonimeController {
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
                message: 'Silahkan isi query search, contoh ?search=dr stone',
            }, 400)
        }

        const keyword = search.replace(/ /g, '+')
        const urlKusonime = `https://kusonime.com/?s=${keyword}&post_type=post`;

        const browser = await puppeteer.launch(puppeteerValues.options)
        try {
            const page = await browser.newPage()
            // user agent
            await page.setUserAgent(puppeteerValues.userAgent)

            await page.goto(urlKusonime, { waitUntil: 'networkidle0' })

            // get link from first result
            const xpathSearchResult = '//div[@class="venz"]/ul'
            await page.waitForXPath(xpathSearchResult)
            const [elementSearchResult] = await page.$x(xpathSearchResult)
            const resultUrl = await page.evaluate((element) => {
                // get first link from first result
                const allResult = element.querySelectorAll('div.kover')
                let firstResultUrl

                // check if no result
                if (allResult.length !== 0) {
                    const firstResult = allResult[0]
                    firstResultUrl = firstResult.querySelector('div > div.content > h2 > a').getAttribute('href')
                }

                return firstResultUrl
            }, elementSearchResult)

            // jika tidak ada url ny maka return saja
            if (!resultUrl) {
                return new CustomMessage(response).error({
                    status_code: 404,
                    message: 'Maaf, tidak ada hasil untuk mu',
                }, 404, async () => { await browser.close() })
            }

            // lets scrape it
            const xpathMainPage = '//div[@class="venser"]'
            await page.goto(resultUrl)
            await page.waitForXPath(xpathMainPage)
            const [elementMainPage] = await page.$x(xpathMainPage)

            const result = await page.evaluate((element) => {
                const thumbs = element.querySelector('div.post-thumb > img').getAttribute('src')
                const title = element.querySelector('div.post-thumb > h1').innerText
                // output Japanese: bla bla bla
                const titleJp = element.querySelector('div.venutama > div.lexot > div.info > p:nth-child(1)').innerText.split(':')[1].trim()
                // output Genre: bla, bla, bla
                const genres = element.querySelectorAll('div.venutama > div.lexot > div.info > p:nth-child(2) > a')
                const genre = (() => {
                    const temp = []
                    for (let i = 0; i < genres.length; i++) {
                        temp.push(genres[i].innerText)
                    }
                    return temp.join(', ')
                })()
                // output Seasons: bla bla bla
                const season = element.querySelector('div.venutama > div.lexot > div.info > p:nth-child(3) > a').innerText
                // output Producers: bla bla bla
                const producer = element.querySelector('div.venutama > div.lexot > div.info > p:nth-child(4)').innerText.split(':')[1].trim()
                // output Type: bla bla bla
                const type = element.querySelector('div.venutama > div.lexot > div.info > p:nth-child(5)').innerText.split(':')[1].trim()
                // output Status: bla bla bla
                const status = element.querySelector('div.venutama > div.lexot > div.info > p:nth-child(6)').innerText.split(':')[1].trim()
                // output Total Episode: bla bla bla
                const totalEpisode = element.querySelector('div.venutama > div.lexot > div.info > p:nth-child(7)').innerText.split(':')[1].trim()
                // output Score: bla bla bla
                const score = element.querySelector('div.venutama > div.lexot > div.info > p:nth-child(8)').innerText.split(':')[1].trim()
                // output Duration: bla bla bla
                const duration = element.querySelector('div.venutama > div.lexot > div.info > p:nth-child(9)').innerText.split(':')[1].trim()
                // output Released On: bla bla bla
                const releasedOn = element.querySelector('div.venutama > div.lexot > div.info > p:nth-child(10)').innerText.split(':')[1].trim()
                // get description
                const descriptions = element.querySelectorAll('div.venutama > div.lexot > p')
                const description = (() => {
                    const temp = []
                    // -3 karena 3 terakhir sampah, isi cuman line break dan text tanda download
                    for (let i = 0; i < (descriptions.length - 3); i++) {
                        temp.push(descriptions[i].innerText)
                    }
                    return temp.join('\n')
                })()

                // get download, jika banyak list download ambil yang paling atas saja [0]
                const downloadBody = element.querySelectorAll('div.venutama > div.lexot > div.dlbod > div.smokeddl')
                const download = (() => {
                    const downloadListResult = []
                    const downloadUrl = downloadBody[0].querySelectorAll('div.smokeurl')

                    // jika ada link download atau tidak
                    const checkDownloadList = downloadUrl[0].querySelectorAll('a')
                    if (checkDownloadList.length === 0) {
                        return []
                    }

                    // resolution
                    for (let i = 0; i < downloadUrl.length; i++) {
                        // get url
                        const aPerResolutionArray = []
                        const aPerResolution = downloadUrl[i].querySelectorAll('a')

                        for (let j = 0; j < aPerResolution.length; j++) {
                            const downloadLink = aPerResolution[j].getAttribute('href')

                            const perResolution = {
                                download_link: downloadLink,
                                downloader: aPerResolution[j].innerText,
                            }
                            aPerResolutionArray.push(perResolution)
                        }

                        downloadListResult.push({
                            resolution: downloadUrl[i].querySelector('strong').innerText,
                            download_list: aPerResolutionArray,
                        })
                    }

                    return downloadListResult
                })()

                const dataScrape = {
                    thumbs,
                    title,
                    title_jp: titleJp,
                    genre,
                    season,
                    producer,
                    type,
                    status,
                    total_episode: totalEpisode,
                    score,
                    duration,
                    released_on: releasedOn,
                    description,
                    download,
                }
                return dataScrape
            }, elementMainPage)

            // jika tidak ada download link
            if (result.download !== null) {
                // get original url
                for (let i = 0; i < result.download.length; i++) {
                    const downloadList = result.download[i].download_list
                    for (let j = 0; j < downloadList.length; j++) {
                        const queryData = urlParse(downloadList[j].download_link, { parseQueryString: true }).query

                        // jika query.url ada maka pakai itu
                        // jika tidak ada maka pakai saja yang belum diparsing
                        if (queryData.url) {
                            downloadList[j].download_link = queryData.url
                        }
                    }
                }
            }

            return new CustomMessage(response).success(result, 200, async () => { await browser.close() })
        } catch (err) {
            return new CustomMessage(response).error({
                status_code: 500,
                message: err.message,
            }, 500, async () => { await browser.close() })
        }
    }
}

module.exports = { KusonimeController }
