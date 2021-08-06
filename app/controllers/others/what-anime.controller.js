const axios = require('axios')
const { CustomMessage } = require('helpers/CustomMessage')

class WhatAnimeController {
    constructor(req, res) {
        this.request = req
        this.response = res
    }

    async controller() {
        const { request, response } = this
        const { limit, url } = request.query

        try {
            if (!url) {
                return new CustomMessage(response).error({
                    status_code: 400,
                    message: 'Silahkan isi query url, contoh: ?url=http://example.com',
                }, 400)
            }

            const traceResponse = await axios.get(`https://api.trace.moe/search?url=${url}`)
            const resultArray = []
            const loopLimit = limit || traceResponse.data.result.length
            for (let i = 0; i < loopLimit; i++) {
                const malId = traceResponse.data.result[i].anilist
                const similarity = Math.floor(traceResponse.data.result[i].similarity * 10)

                try {
                    // eslint-disable-next-line no-await-in-loop
                    const jikanResponse = await axios.get(`https://api.jikan.moe/v3/anime/${malId}`)
                    const myAnimeList = jikanResponse.data.url
                    const thumb = jikanResponse.data.image_url
                    const title = jikanResponse.data.title
                    const titleJp = jikanResponse.data.title_japanese
                    const score = jikanResponse.data.score
                    const season = jikanResponse.data.premiered
                    const genre = jikanResponse.data.genres.map((map) => map.name).join(', ')

                    const result = {
                        url: myAnimeList,
                        thumb,
                        title,
                        title_jp: titleJp,
                        score,
                        genre,
                        season,
                        similarity,
                    }
                    resultArray.push(result)
                } catch (err) {
                    // catch if 404 in jikanime
                }
            }

            return new CustomMessage(response).success(resultArray)
        } catch (err) {
            return new CustomMessage(response).error({
                status_code: 500,
                message: err.message,
            }, 500)
        }
    }
}

module.exports = { WhatAnimeController }
