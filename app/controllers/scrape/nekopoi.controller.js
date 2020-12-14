const axios = require('axios')
const cheerio = require('cheerio')
const { CustomMessage } = require('helpers/CustomMessage')

class NekopoiController {
    constructor(req, res) {
        this.request = req
        this.response = res
    }

    async controller() {
        const { response } = this
        const page = 1 + Math.floor(Math.random() * 258)
        const url = `https://nekopoi.care/page/${page}`

        try {
            // search page
            const responseSearch = await axios.get(url)
            const selectorSearch = cheerio.load(responseSearch.data)
            const searchResult = selectorSearch('#boxid').children('.eropost')
            const randomPost = 1 + Math.floor(Math.random() * searchResult.length)
            const post = selectorSearch(selectorSearch('#boxid').children('.eropost').get(randomPost))
            const postUrl = post.find('.eroinfo > h2 > a').attr('href')

            // content page
            const responseContent = await axios.get(postUrl)
            const selectorContent = cheerio.load(responseContent.data)
            const rootHeader = selectorContent('.eropost > .eroinfo')
            const rootContent = selectorContent('.contentpost')
            const rootDownload = selectorContent('.arealinker > .boxdownload')

            const resultResponse = {}
            resultResponse.thumb = rootContent.find('.thm > img').attr('src')
            resultResponse.url = postUrl
            // info
            const getText = (infoType) => {
                const info = rootContent.find('.konten > p').filter((i, elm) => {
                    const type = selectorContent(elm).text().split(':')[0].trim()
                    if (type === infoType) return true
                    return false
                })
                const textArray = info.text().split(':')
                return textArray.slice(1, textArray.length).join('').trim()
            }
            resultResponse.title = rootHeader.children('h1').text()
            resultResponse.title_jp = getText('Japanese Title')
            resultResponse.movie_id = getText('Movie ID')
            resultResponse.producers = getText('Producers')
            resultResponse.costume = getText('Costume')
            resultResponse.artist = getText('Artist')
            resultResponse.genre = getText('Genre')
            resultResponse.duration = getText('Duration')
            resultResponse.size = getText('Size').split('|').map((val) => val.trim()).join(' | ')

            // download
            resultResponse.downloads = []
            rootDownload.find('.liner').each((i, elm) => {
                const title = selectorContent(elm).children('.name').text()
                const downloadLink = []
                selectorContent(elm).find('.listlink > p > a').each((iA, elmA) => {
                    const server = selectorContent(elmA).text()
                    const link = selectorContent(elmA).attr('href')
                    downloadLink.push({ server, link })
                })
                resultResponse.downloads.push({ title, download_link: downloadLink })
            })

            return new CustomMessage(response).success(resultResponse)
        } catch (err) {
            return new CustomMessage(response).error({
                status_code: 500,
                message: err.message,
            }, 500)
        }
    }
}

module.exports = { NekopoiController }
