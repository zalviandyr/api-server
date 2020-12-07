const puppeteer = require('puppeteer')
const { puppeteerValues } = require('helpers/values')
const { CustomMessage } = require('helpers/CustomMessage')

class YtSearchController {
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
                message: 'Silahkan input query search, contoh: ?search=mitis moments',
            }, 400)
        }

        const keyword = search.replace(/ /g, '+')
        const url = `https://www.youtube.com/results?search_query=${keyword}`
        const browser = await puppeteer.launch(puppeteerValues.options)
        try {
            const page = await browser.newPage()
            // user agent
            await page.setUserAgent(puppeteerValues.userAgent)

            await page.goto(url, { waitUntil: 'networkidle0' })

            const xpathSearchResult = '//ytd-item-section-renderer[@class="style-scope ytd-section-list-renderer"]/div[@id="contents"]'
            await page.waitForXPath(xpathSearchResult)
            const [elementsSearchResult] = await page.$x(xpathSearchResult)
            const result = await page.evaluate((element) => {
                const searchResult = element.querySelectorAll('ytd-video-renderer')

                let elementVideo
                // cek jika video tidak live, video live tidak mempunyai durasi
                for (let i = 0; i < searchResult.length; i++) {
                    const tempDuration = searchResult[i].querySelector('div > ytd-thumbnail > a > div > ytd-thumbnail-overlay-time-status-renderer')
                    if (tempDuration) {
                        elementVideo = searchResult[i]
                        break
                    }
                }

                const thumb = elementVideo.querySelector('div > ytd-thumbnail > a > yt-img-shadow > img').getAttribute('src')
                const duration = elementVideo.querySelector('div > ytd-thumbnail > a > div > ytd-thumbnail-overlay-time-status-renderer').innerText
                const title = elementVideo.querySelector('div > div > div > div > h3').innerText
                const link = (() => {
                    const temp = elementVideo.querySelector('div > div > div > div > h3 > a').getAttribute('href')
                    return 'https://www.youtube.com' + temp
                })()
                const views = elementVideo.querySelector('div > div > div#meta > ytd-video-meta-block > div#metadata > div#metadata-line > span:nth-child(1)').textContent
                const upload = elementVideo.querySelector('div > div > div#meta > ytd-video-meta-block > div#metadata > div#metadata-line > span:nth-child(2)').textContent
                const channelLink = (() => {
                    const temp = elementVideo.querySelector('div > div > div#channel-info > a').getAttribute('href')
                    return 'https://www.youtube.com' + temp
                })()
                const channelTitle = elementVideo.querySelector('div > div > div#channel-info > ytd-channel-name').innerText
                const description = elementVideo.querySelector('div > div > yt-formatted-string#description-text').innerText

                return {
                    thumb, title, duration, link, views, upload, channel_link: channelLink, channel_title: channelTitle, description,
                }
            }, elementsSearchResult)

            return new CustomMessage(response).success(result, 200, async () => { await browser.close() })
        } catch (err) {
            return new CustomMessage(response).error({
                status_code: 500,
                message: err.message,
            }, 500, async () => { await browser.close() })
        }
    }
}

module.exports = { YtSearchController }
