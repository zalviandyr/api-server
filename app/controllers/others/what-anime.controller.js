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
        const { image } = request.body
        const method = request.method
        let traceResponse;

        try {
            if (method === 'POST') {
                if (!image) {
                    return new CustomMessage(response).error({
                        status_code: 400,
                        message: 'Silahkan isi form image dengan nilai base64 dari image',
                    }, 400)
                }

                traceResponse = await axios({
                    method: 'post',
                    url: 'https://trace.moe/api/search',
                    headers: { 'Content-Type': 'application/json' },
                    data: { image },
                })
            }

            if (method === 'GET') {
                if (!url) {
                    return new CustomMessage(response).error({
                        status_code: 400,
                        message: 'Silahkan isi query url, contoh: ?url=http://example.com',
                    }, 400)
                }

                traceResponse = await axios.get(`https://trace.moe/api/search?url=${url}`)
            }

            const resultArray = []
            const loopLimit = limit || traceResponse.data.docs.length
            for (let i = 0; i < loopLimit; i++) {
                const malId = traceResponse.data.docs[i].mal_id
                const similarity = Math.floor(traceResponse.data.docs[i].similarity * 10)
                const adult = traceResponse.data.docs[i].is_adult

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
                    adult,
                }
                resultArray.push(result)
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
