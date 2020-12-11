const axios = require('axios')
const cheerio = require('cheerio')
const { CustomMessage } = require('helpers/CustomMessage')

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

        try {
            // search page
            const responseSearch = await axios.get(urlKusonime)
            const selectorSearch = cheerio.load(responseSearch.data)
            const searchResult = selectorSearch('div[class="venz"] > ul')
            const firstSearchUrl = searchResult.contents().first().find('h2[class="episodeye"] > a').attr('href')
            if (searchResult.contents().length === 0) {
                return new CustomMessage(response).error({
                    status_code: 404,
                    message: 'Maaf, tidak ada hasil untuk mu',
                }, 404)
            }

            // content page
            const responseContent = await axios.get(firstSearchUrl)
            const selectorContent = cheerio.load(responseContent.data)
            const rootContent = selectorContent('div[class="venser"]')
            const rootBody = rootContent.find('div[class="lexot"]')
            const rootInfo = rootBody.children('div[class="info"]')

            const resultResponse = {}
            resultResponse.thumbs = rootContent.find('div[class="post-thumb"] > img').attr('src')
            resultResponse.title = rootContent.find('div[class="post-thumb"] > h1').text()
            resultResponse.title_jp = selectorContent(rootInfo.children('p').get(0)).text().split(':')[1].trim()
            resultResponse.genre = selectorContent(rootInfo.children('p').get(1)).text().split(':')[1].trim()
            resultResponse.season = selectorContent(rootInfo.children('p').get(2)).text().split(':')[1].trim()
            resultResponse.producer = selectorContent(rootInfo.children('p').get(3)).text().split(':')[1].trim()
            resultResponse.type = selectorContent(rootInfo.children('p').get(4)).text().split(':')[1].trim()
            resultResponse.status = selectorContent(rootInfo.children('p').get(5)).text().split(':')[1].trim()
            resultResponse.total_episode = selectorContent(rootInfo.children('p').get(6)).text().split(':')[1].trim()
            resultResponse.score = selectorContent(rootInfo.children('p').get(7)).text().split(':')[1].trim()
            resultResponse.duration = selectorContent(rootInfo.children('p').get(8)).text().split(':')[1].trim()
            resultResponse.released_on = selectorContent(rootInfo.children('p').get(9)).text().split(':')[1].trim()
            resultResponse.description = rootBody.children('p').first().text()
            resultResponse.download = (() => {
                const temp = []
                const downloadBody = rootBody.children('div[class="dlbod"]').children('div[class="smokeddl"]').first()
                downloadBody.children('div[class="smokeurl"]').each((i, elm) => {
                    const downloadList = []
                    const resolution = selectorContent(elm).children('strong').text()
                    selectorContent(elm).children('a').each((iA, elmA) => {
                        const downloadLink = selectorContent(elmA).attr('href')
                        const downloader = selectorContent(elmA).text()
                        downloadList.push({ download_link: downloadLink, downloader })
                    })

                    temp.push({ resolution, download_list: downloadList })
                })
                return temp
            })()

            return new CustomMessage(response).success(resultResponse)
        } catch (err) {
            return new CustomMessage(response).error({
                status_code: 500,
                message: err.message,
            }, 500)
        }
    }
}

module.exports = { KusonimeController }
