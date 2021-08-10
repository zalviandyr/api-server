module.exports = (app) => {
    app.get('/translate', (req, res) => {
        // #swagger.tags = ['Other']
        // #swagger.description = 'Mentranslatekan text dalam bahasa apapun ke bahasa indonesia'
        /* #swagger.parameters['text'] = {
            required: true,
            description: 'Text yang ingin di translate'
        } */
        const { text } = req.query;
        res.status(200).send(true);
    });

    app.get('/speech', (req, res) => {
        // #swagger.tags = ['Other']
        // #swagger.description = 'List bahasa yang tersedia, [List Language](https://github.com/zalviandyr/api-server#speech-language-list)'
        res.status(200).send(true);
    });

    app.get('/speech/:lang', (req, res) => {
        // #swagger.tags = ['Other']
        // #swagger.description = 'Mengkonversi text ke dalam suara'
        // #swagger.produces = ['audio/mpeg']
        // #swagger.parameters['text'] = { required: true }
        const { text } = req.query;
        res.status(200).send(true);
    });

    app.get('/covid-indonesia', (req, res) => {
        // #swagger.tags = ['Other']
        // #swagger.description = 'Menampilkan status covid di indonesia'
        res.status(200).send(true);
    });

    app.get('/kabupaten-kota', (req, res) => {
        // #swagger.tags = ['Other']
        // #swagger.description = 'Menampilkan list kabupaten kota dan provinsi di indonesia'
        const { provinsi } = req.query;
        res.status(200).send(true);
        res.status(404).send(false);
    });

    app.get('/kabupaten-kota/:provinsi', (req, res) => {
        // #swagger.tags = ['Other']
        // #swagger.description = 'Menampilkan list kabupaten kota sesuai provinsi di indonesia'
        res.status(200).send(true);
        res.status(404).send(false);
    });

    app.get('/quote', (req, res) => {
        // #swagger.tags = ['Other']
        // #swagger.description = 'Menampilkan list genre quote yang tersedia'
        res.status(200).send(true);
    });

    app.get('/quote/:genre', (req, res) => {
        // #swagger.tags = ['Other']
        // #swagger.description = 'Menampilkan quote sesuai type, [List Type](https://github.com/zalviandyr/api-server#quote-type-list)'
        res.status(200).send(true);
    });

    app.get('/quote-maker', (req, res) => {
        // #swagger.tags = ['Other']
        // #swagger.description = 'Membuat quote'
        // #swagger.parameters['author] = { required: true }
        // #swagger.parameters['quote] = { required: true }
        const { author, quote } = req.query;
        res.status(200).send(true);
    });

    app.get('/bosan', (req, res) => {
        // #swagger.tags = ['Other']
        // #swagger.description = 'Menampilkan kegiatan di saat bosan'
        res.status(200).send(true);
    });

    app.get('/meme', (req, res) => {
        // #swagger.tags = ['Other']
        // #swagger.description = 'Menampilkan meme random di reddit'
        res.status(200).send(true);
    });

    app.get('/saweria', (req, res) => {
        // #swagger.tags = ['Other']
        // #swagger.description = 'Menampilkan donasi saweria'
        res.status(200).send(true);
    });

    app.get('/lirik', (req, res) => {
        // #swagger.tags = ['Other']
        // #swagger.description = 'Menampilkan hasil search lirik'
        // #swagger.parameters['search'] = { required: true }
        const { search } = req.query;
        res.status(200).send(true);
    });

    app.get('/wiki', (req, res) => {
        // #swagger.tags = ['Other']
        // #swagger.description = 'Menampilkan hasil search wiki berdasarkan kata kunci'
        // #swagger.parameters['search'] = { required: true }
        const { search } = req.query;
        res.status(200).send(true);
    });
};
