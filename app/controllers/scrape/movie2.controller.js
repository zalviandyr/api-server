const axios = require('axios')
const cheerio = require('cheerio')
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

        try {
            // search page
            const responseSearch = await axios.get(url)
            const selectorSearch = cheerio.load(responseSearch.data)
            const searchResult = selectorSearch(selectorSearch('div#movies > div').get(1)).children('div')
            const firstSearchUrl = searchResult.first().children('a').attr('href')
            if (searchResult.length === 0) {
                return new CustomMessage(response).error({
                    status_code: 404,
                    message: 'Maaf, tidak ada hasil untuk mu',
                }, 404)
            }

            // content page
            const responseContent = await axios.get(firstSearchUrl)
            const selectorContent = cheerio.load(responseContent.data)
            const root = selectorContent('div#main-content')
            const rootHeader = root.children('div.tpost')
            const rootDetail = root.children('div.info_movie').children('div.postdetail')
            const rootDownload = root.find('table.download > tbody > tr:not(.ini)')

            const resultResponse = {}
            resultResponse.thumb = rootHeader.find('div > img').attr('src')
            resultResponse.score = rootHeader.find('div > div > span.bg-yellow-105').first().text()
            resultResponse.quality = rootHeader.find('div > div > span.bg-orange-500').last().text()
            resultResponse.title = rootDetail.children('h1').text()

            // year, country and duration
            let temp
            temp = rootDetail.children('div.thn').children('div.mr-4')
            resultResponse.year = temp.first().text()
            resultResponse.country = temp.next().first().text()
            resultResponse.duration = temp.last().text()

            temp = rootDetail.children('div.info').children('p')
            resultResponse.director = temp.first().text().split(':')[1].trim()
            resultResponse.rating = temp.next().first().text().split(':')[1].trim()
            resultResponse.genre = temp.last().children('a')
                .map((i, elm) => selectorContent(elm).text())
                .get()
                .join(', ')

            resultResponse.synopsis = root.find('div#tab-1 > p').text()
            resultResponse.trailer = root.find('div#tab-2 > div.player-embed > iframe').attr('src')

            // downloads
            resultResponse.downloads = []
            rootDownload.each((i, elm) => {
                const tempTd = selectorContent(elm).children('td')
                const server = selectorContent(tempTd.get(0)).text()
                const description = selectorContent(tempTd.get(1)).text()
                const link = selectorContent(tempTd.get(1)).children('a').attr('href')
                const size = selectorContent(tempTd.get(2)).text()
                resultResponse.downloads.push({
                    server, description, link, size,
                })
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

module.exports = { Movie2Controller }
