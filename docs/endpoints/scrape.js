/* eslint-disable no-unused-vars */
module.exports = (app) => {
    app.get('/kusonime', (req, res) => {
        // #swagger.tags = ['Scrape']
        // #swagger.description = 'Menampilkan hasil search anime di kusonime'
        // #swagger.parameters['search'] = { required: true }
        const { search } = req.query;
        res.status(200).send(true);
    });

    app.get('/arti-nama', (req, res) => {
        // #swagger.tags = ['Scrape']
        // #swagger.description = 'Menampilkan hasil arti sebuah nama'
        // #swagger.parameters['nama'] = { required: true }
        const { nama } = req.query;
        res.status(200).send(true);
    });

    app.get('/pasangan', (req, res) => {
        // #swagger.tags = ['Scrape']
        // #swagger.description = 'Menampilkan hasil ramalan antara pasangan menggunakan nama'
        // #swagger.parameters['nama1'] = { required: true }
        // #swagger.parameters['nama2'] = { required: true }
        const { nama1, nama2 } = req.query;
        res.status(200).send(true);
    });

    app.get('/penyakit', (req, res) => {
        // #swagger.tags = ['Scrape']
        // #swagger.description = 'Menampilkan hasil ramalan penyakit berdasarkan tanggal'
        /* #swagger.parameters['tanggal'] = {
            required: true,
            description: 'Format tanggal DD-MM-YYYY. Contoh 11-12-2000'
        } */
        const { tanggal } = req.query;
        res.status(200).send(true);
    });

    app.get('/pekerjaan', (req, res) => {
        // #swagger.tags = ['Scrape']
        // #swagger.description = 'Menampilkan hasil ramalan pekeejaan berdasarkan tanggal'
        /* #swagger.parameters['tanggal'] = {
            required: true,
            description: 'Format tanggal DD-MM-YYYY. Contoh 11-12-2000'
        } */
        const { tanggal } = req.query;
        res.status(200).send(true);
    });

    app.get('/drakorasia', (req, res) => {
        // #swagger.tags = ['Scrape']
        // #swagger.description = 'Menampilkan hasil search anime di website drakorasia'
        // #swagger.parameters['search'] = { required: true }
        const { search } = req.query;
        res.status(200).send(true);
    });

    app.get('/lirik', (req, res) => {
        // #swagger.tags = ['Scrape']
        // #swagger.description = 'Menampilkan hasil search lirik'
        // #swagger.parameters['search'] = { required: true }
        const { search } = req.query;
        res.status(200).send(true);
    });

    app.get('/movie', (req, res) => {
        // #swagger.tags = ['Scrape']
        // #swagger.description = 'Menampilkan hasil search movie'
        // #swagger.parameters['search'] = { required: true }
        const { search } = req.query;
        res.status(200).send(true);
    });

    app.get('/movie2', (req, res) => {
        // #swagger.tags = ['Scrape']
        // #swagger.description = 'Menampilkan hasil search movie2'
        // #swagger.parameters['search'] = { required: true }
        const { search } = req.query;
        res.status(200).send(true);
    });

    app.get('/manga', (req, res) => {
        // #swagger.tags = ['Scrape']
        // #swagger.description = 'Menampilkan hasil search manga berdasarkan kata kunci'
        // #swagger.parameters['keyword'] = { required: true }
        const { keyword } = req.query;
        res.status(200).send(true);
    });

    app.get('/wiki', (req, res) => {
        // #swagger.tags = ['Scrape']
        // #swagger.description = 'Menampilkan hasil search wiki berdasarkan kata kunci'
        // #swagger.parameters['keyword'] = { required: true }
        const { keyword } = req.query;
        res.status(200).send(true);
    });

    app.get('/neonime', (req, res) => {
        // #swagger.tags = ['Scrape']
        // #swagger.description = 'Menampilkan hasil search di neonime'
        // #swagger.parameters['search'] = { required: true }
        const { search } = req.query;
        res.status(200).send(true);
    });

    app.get('/nekopoi', (req, res) => {
        // #swagger.tags = ['Scrape']
        // #swagger.description = 'Menampilkan hasil random dari nekopoi'
        res.status(200).send(true);
    });
};
