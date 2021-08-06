/* eslint-disable no-unused-vars */
module.exports = (app) => {
    app.get('/kabupaten-kota', (req, res) => {
        // #swagger.tags = ['Other']
        // #swagger.description = 'Menampilkan list kabupaten kota di indonesia'
        /* #swagger.parameters['provinsi'] = {
            description: 'Optional',
        } */
        const { provinsi } = req.query
        res.status(200).send(true)
        res.status(404).send(false)
    })

    app.get('/covid-indonesia', (req, res) => {
        // #swagger.tags = ['Other']
        // #swagger.description = 'Menampilkan status covid di indonesia'
        res.status(200).send(true)
    })

    app.get('/quote-maker', (req, res) => {
        // #swagger.tags = ['Other']
        // #swagger.description = 'Membuat quote'
        // #swagger.parameters['author] = { required: true }
        // #swagger.parameters['quote] = { required: true }
        const { author, quote } = req.query
        res.status(200).send(true)
    })

    app.get('/meme', (req, res) => {
        // #swagger.tags = ['Other']
        // #swagger.description = 'Menampilkan meme random di reddit'
        res.status(200).send(true)
    })

    app.get('/translate', (req, res) => {
        // #swagger.tags = ['Other']
        // #swagger.description = 'Mentranslatekan text dalam bahasa apapun ke bahasa indonesia'
        /* #swagger.parameters['text'] = {
            required: true,
            description: 'Text yang ingin di translate'
        } */
        const { text } = req.query
        res.status(200).send(true)
    })

    app.get('/bosan', (req, res) => {
        // #swagger.tags = ['Other']
        // #swagger.description = 'Menampilkan kegiatan di saat bosan'
        res.status(200).send(true)
    })

    app.get('/anime-pic', (req, res) => {
        // #swagger.tags = ['Other']
        // #swagger.description = 'Menampilkan gambar anime sesuai genre, [List Genre](https://github.com/zalviandyr/api-server#anime-pic-genre-list)'
        const { genre } = req.query
        res.status(200).send(true)
    })

    app.get('/speech', (req, res) => {
        // #swagger.tags = ['Other']
        // #swagger.description = 'Mengkonversi text ke dalam suara, [List Language](https://github.com/zalviandyr/api-server#speech-language-list)'
        // #swagger.produces = ['audio/mpeg']
        // #swagger.parameters['lang'] = { required: true }
        // #swagger.parameters['text'] = { required: true }
        const { lang, text } = req.query
        res.status(200).send(true)
    })

    app.get('/quote', (req, res) => {
        // #swagger.tags = ['Other']
        // #swagger.description = 'Menampilkan quote sesuai type, [List Type](https://github.com/zalviandyr/api-server#quote-type-list)'
        // #swagger.parameters['type'] = { required: true }
        const { type } = req.query
        res.status(200).send(true)
    })

    app.get('/what-anime', (req, res) => {
        // #swagger.tags = ['Other']
        // #swagger.description = 'Menampilkan quote sesuai type, [List Type](https://github.com/zalviandyr/api-server#quote-type-list)'
        /* #swagger.parameters['limit'] = {
            description: 'Limit the result'
        } */
        /* #swagger.parameters['url'] = {
            required: true,
            description: 'URL dari anime gambar',
        } */
        const { limit, url } = req.query
        res.status(200).send(true)
    })

    app.get('/saweria', (req, res) => {
        // #swagger.tags = ['Other']
        // #swagger.description = 'Menampilkan donasi saweria'
        res.status(200).send(true)
    })
}
