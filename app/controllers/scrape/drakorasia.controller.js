const puppeteer = require('puppeteer')
const { puppeteerValues } = require('helpers/values')
const { shortTitleDrakorasia } = require('helpers/values')
const { CustomMessage } = require('helpers/CustomMessage')

class DrakorasiaController {
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
                message: 'Silahkan isi query search, contoh ?search=tale',
            }, 400)
        }

        const keyword = search.replace(/ /g, '+')
        const url = `https://drakorasia.net/?s=${keyword}&post_type=post`;

        const browser = await puppeteer.launch(puppeteerValues.options)

        try {
            const page = await browser.newPage()
            await page.setUserAgent(puppeteerValues.userAgent)

            await page.goto(url)

            const xpathSearchResult = '//div[@class="mulai"]/div[@class="pem"]/div[@class="row"]'
            await page.waitForXPath(xpathSearchResult)
            const [elementSearchResult] = await page.$x(xpathSearchResult)
            const firstResultUrl = await page.evaluate((element) => {
                const result = element.querySelector('div.ct-th')
                if (result === null) {
                    return null
                }
                return element.querySelector('div.ct-th > div.ct-tt > a').getAttribute('href')
            }, elementSearchResult)

            if (firstResultUrl) {
                await page.goto(firstResultUrl)

                const xpathContainer = '//div[@class="if-ct"]/div[@class="inf"]/div[@class="container"]'
                await page.waitForXPath(xpathContainer)
                const [elementContainer] = await page.$x(xpathContainer)
                const containerResult = await page.evaluate((element) => {
                    const thumb = element.querySelector('div.if-th > img').getAttribute('src')
                    const title = element.querySelector('div.if-tt > h1').innerText
                    const titleKr = element.querySelector('div.if-tt > p').innerText.split('/')[0].trim()
                    const year = element.querySelector('div.if-tt > p').innerText.split('/')[1].trim()
                    const episode = element.querySelector('div.if-tt > p').innerText.split('/')[2].trim()
                    const genre = element.querySelector('div.if-tt > p.genres').innerText.replace(/ - /g, ', ')
                    const duration = element.querySelector('div.if-tt > p.nt > span').innerText
                    const network = element.querySelector('div.if-tt > p.nt > a').innerText

                    return {
                        thumb, title, titleKr, year, episode, genre, duration, network,
                    }
                }, elementContainer)

                const xpathContainerWrapper = '//div[@class="container wrapper"]/div/div/div/div'
                await page.waitForXPath(xpathContainerWrapper)
                const [elementContainerWrapper] = await page.$x(xpathContainerWrapper)
                const containerWrapperResult = await page.evaluate((element, shortTitleDownload) => {
                    const synopsis = element.querySelector('div#synopsis > p').innerText
                    const casters = (() => {
                        const castersElement = element.querySelectorAll('div.caster > a')
                        const temp = []
                        for (let i = 0; i < castersElement.length; i++) {
                            temp.push(castersElement[i].textContent)
                        }
                        return temp.join(', ')
                    })()
                    const contentPost = element.querySelector('div#content-post > table')

                    const resolutionDownload = (() => {
                        const resDownloadAvailable = contentPost.querySelectorAll('thead > tr > th')
                        const temp = []
                        for (let i = 1; i < resDownloadAvailable.length; i++) {
                            temp.push(resDownloadAvailable[i].innerText.split(' ')[1])
                        }
                        return temp
                    })()

                    const episodes = (() => {
                        const tempEpisodes = contentPost.querySelectorAll('tbody > tr')
                        const tempResult = []
                        for (let i = 0; i < tempEpisodes.length; i++) {
                            const episode = tempEpisodes[i].querySelector('td:nth-child(1)').innerText
                            const tempDownloads = []

                            for (let j = 0; j < resolutionDownload.length; j++) {
                                const downloadList = tempEpisodes[i].querySelectorAll(`td:nth-child(${j + 2}) > a`)
                                const resolution = resolutionDownload[j]
                                const tempDownloadLink = []

                                for (let k = 0; k < downloadList.length; k++) {
                                    const title = (() => {
                                        const tempTitle = downloadList[k].textContent.trim()
                                        for (let l = 0; l < shortTitleDownload.length; l++) {
                                            if (tempTitle === shortTitleDownload[l].shortName) {
                                                return shortTitleDownload[l].name
                                            }
                                        }
                                        return tempTitle
                                    })()
                                    const link = downloadList[k].getAttribute('href')
                                    tempDownloadLink.push({
                                        title,
                                        link,
                                    })
                                }
                                tempDownloads.push({
                                    resolution,
                                    download_link: tempDownloadLink,
                                })
                            }
                            tempResult.push({
                                episode,
                                downloads: tempDownloads,
                            })
                        }
                        return tempResult
                    })()

                    return { synopsis, casters, episodes }
                }, elementContainerWrapper, shortTitleDrakorasia)

                return new CustomMessage(response).success(
                    Object.assign(containerResult, containerWrapperResult),
                    200,
                    async () => { await browser.close() },
                )
            }

            return new CustomMessage(response).error({
                status_code: 404,
                message: 'Maaf, tidak ada hasil untuk mu',
            }, 404, async () => { await browser.close() })
        } catch (err) {
            return new CustomMessage(response).error({
                status_code: 500,
                message: err.message,
            }, 500, async () => { await browser.close() })
        }
    }
}

module.exports = { DrakorasiaController }
