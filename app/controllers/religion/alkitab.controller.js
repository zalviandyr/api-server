const axios = require('axios')
const { transform } = require('camaro')
const { CustomMessage } = require('helpers/CustomMessage')

class AlkitabController {
    constructor(req, res) {
        this.request = req
        this.response = res
    }

    async controller() {
        const { request, response } = this
        const { name, chapter, number } = request.query

        if (!name && !chapter && !number) {
            return new CustomMessage(response).error({
                status_code: 400,
                message: 'Silahkan isi query name, chapter dan number, contoh: ?name=yohanes&chapter=1&number=1',
            }, 400)
        }

        try {
            const url = `https://alkitab.sabda.org/api/passage.php?passage=${name.toLowerCase()}+${chapter}:${number}`
            const result = await axios.get(url)
            const xml = result.data
            const template = ['/bible/book', {
                name: '@name',
                title: 'title',
                chapter: 'chapter/chap',
                description: ['chapter/verses/verse', {
                    number: 'number',
                    text: 'text',
                }],
            }]

            const resultResponse = await transform(xml, template)
            return new CustomMessage(response).success(resultResponse[0])
        } catch (err) {
            return new CustomMessage(response).error({
                status_code: 500,
                message: err.message,
            }, 500)
        }
    }
}

module.exports = { AlkitabController }
