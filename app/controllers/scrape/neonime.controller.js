const axios = require('axios')
const cheerio = require('cheerio')
const { CustomMessage } = require('helpers/CustomMessage')

class NeonimeController {
    constructor(req, res) {
        this.request = req
        this.response = res
    }

    async controller() {
        const { request, response } = this
        let { search } = request.query

        if (!response) {
            return new CustomMessage(response).error({
                status_code: 400,
                message: 'Silahkan isi query search',
            }, 400)
        }

        search = search.replace(/ /g, '+')
        const url = `https://neonime.site/?s=${search}`

        const responseSearch = await axios.get(url)
        const selectorSearch = cheerio.load(responseSearch.data)
        const firstSearchResultUrl = selectorSearch('div[class="item_1 items"] > div').first().find('a').attr('href')
        const type = selectorSearch('div[class="item_1 items"] > div').first().find('span[class="calidad2 episode"]').text()
        const noResult = selectorSearch('div[class="no_contenido_home"]')
        if (noResult.length === 1) {
            return new CustomMessage(response).error({
                status_code: 404,
                message: 'Maaf, tidak ada hasil untuk mu',
            }, 404)
        }

        const responseContent = await axios.get(firstSearchResultUrl)
        const selectorContent = cheerio.load(responseContent.data)
        if (type === 'Batch') {
            return new CustomMessage(response).error({
                status_code: 404,
                message: 'Maaf, tidak ada hasil untuk mu',
            }, 404)
        }

        const rootLoadA = selectorContent('div[class="ladoA"] > div[id="fixar"]')
        const rootLoadB = selectorContent('div[class="ladoB"] > div[class="central"]')
        const rootDownload = selectorContent(rootLoadB.find('div[id="links"] > div[class="linkstv"] > div > div').get(1))

        const thumb = rootLoadA.find('div[class="imagen"] > a > img').attr('data-src')
        const date = rootLoadA.find('div[class="meta-a"] > p').text()
        const season = rootLoadA.find('div[class="meta-b"] > span[class="metx"]').first().children('i').text()
        const episode = rootLoadB
            .find('div[id="info"] > div[class="metadatac"]')
            .first()
            .children('span').text()
        const genre = rootLoadB
            .find('div[id="info"] > div[class="metadatac"]')
            .filter((i, elm) => selectorContent(elm).find('b').text() === 'Genre')
            .children('span').text()
        const source = rootLoadB
            .find('div[id="info"] > div[class="metadatac"]')
            .filter((i, elm) => selectorContent(elm).find('b').text() === 'Source')
            .children('span').text()
        const title = rootLoadB
            .find('div[id="info"] > div[class="contenidotv"] > h2').text()
        let description = []
        rootLoadB.find('div[id="info"] > div[class="contenidotv"] > div[itemprop="description"] > p')
            .each((i, elm) => {
                if (i > 0) description.push(selectorContent(elm).text())
            })
        description = description.join('\n')

        // get download
        let indexMp4 = 0
        let mp4Exist = false
        let indexMkv = 0
        let mkvExist = false
        let sumIndex = 0
        rootDownload.find('ul').contents().each((i, elm) => {
            if (selectorContent(elm).text() === 'MP4') {
                indexMp4 = i
                mp4Exist = true
            }
            if (selectorContent(elm).text() === 'MKV') {
                indexMkv = i
                mkvExist = true
            }
            if (elm.tagName === 'ul') sumIndex += 1
        })
        // cek jika mp4 ada
        if (mp4Exist && !mkvExist) {
            sumIndex += 1
            indexMkv = sumIndex
            sumIndex = 0
        }
        // cek jika mkv ada
        if (!mp4Exist && mkvExist) {
            sumIndex += 1
            indexMkv = 0
        }
        // jika mp4 dan mkv ada
        if (mp4Exist && mkvExist) {
            sumIndex += 2 // karena termasuk mp4 dan mkv
        }

        const downloadMp4 = []
        rootDownload.find('ul').contents().slice((indexMp4 + 1), indexMkv).each((i1, elm1) => {
            const resolution = selectorContent(elm1).find('li > label').text().trim()

            const server = []
            selectorContent(elm1).find('li > a').each((i2, elm2) => {
                const name = selectorContent(elm2).text()
                const link = selectorContent(elm2).attr('href')
                server.push({ name, link })
            })
            downloadMp4.push({ resolution, server })
        })

        const downloadMkv = []
        rootDownload.find('ul').contents().slice((indexMkv + 1), sumIndex).each((i1, elm1) => {
            const resolution = selectorContent(elm1).find('li > label').text().trim()

            const server = []
            selectorContent(elm1).find('li > a').each((i2, elm2) => {
                const name = selectorContent(elm2).text()
                const link = selectorContent(elm2).attr('href')
                server.push({ name, link })
            })
            downloadMkv.push({ resolution, server })
        })

        const resultResponse = {
            thumb, title, date, season, episode, genre, source, description, download_mp4: downloadMp4, download_mkv: downloadMkv,
        }

        return new CustomMessage(response).success(resultResponse)
    }
}

module.exports = { NeonimeController }
