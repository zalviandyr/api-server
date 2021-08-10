module.exports = (app) => {
    app.get('/anime-pic', (req, res) => {
        // #swagger.tags = ['Anime']
        // #swagger.description = 'Menampilkan list genre yang tersedia, [List Genre](https://github.com/zalviandyr/api-server#anime-pic-genre-list)'
        res.status(200).send(true);
    });

    app.get('/anime-pic/:genre', (req, res) => {
        // #swagger.tags = ['Anime']
        // #swagger.description = 'Menampilkan gambar anime sesuai genre, [List Genre](https://github.com/zalviandyr/api-server#anime-pic-genre-list)'
        res.status(200).send(true);
    });

    app.get('/what-anime', (req, res) => {
        // #swagger.tags = ['Anime']
        // #swagger.description = 'Memprediksi anime sesuai gambar'
        /* #swagger.parameters['limit'] = {
            description: 'Limit the result'
        } */
        /* #swagger.parameters['url'] = {
            required: true,
            description: 'URL dari anime gambar',
        } */
        const { limit, url } = req.query;
        res.status(200).send(true);
    });

    app.get('/kusonime', (req, res) => {
        // #swagger.tags = ['Anime']
        // #swagger.description = 'Menampilkan hasil search anime di kusonime'
        // #swagger.parameters['search'] = { required: true }
        const { search } = req.query;
        res.status(200).send(true);
    });

    app.get('/neonime', (req, res) => {
        // #swagger.tags = ['Anime']
        // #swagger.description = 'Menampilkan hasil search di neonime'
        // #swagger.parameters['search'] = { required: true }
        const { search } = req.query;
        res.status(200).send(true);
    });

    app.get('/nekopoi', (req, res) => {
        // #swagger.tags = ['Anime']
        // #swagger.description = 'Menampilkan hasil random dari nekopoi'
        res.status(200).send(true);
    });

    app.get('/manga', (req, res) => {
        // #swagger.tags = ['Anime']
        // #swagger.description = 'Menampilkan hasil search manga berdasarkan kata kunci'
        // #swagger.parameters['keyword'] = { required: true }
        const { keyword } = req.query;
        res.status(200).send(true);
    });
}