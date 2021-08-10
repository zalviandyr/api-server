module.exports = (app) => {
    app.get('/info-gempa', (req, res) => {
        // #swagger.tags = ['Forecast']
        // #swagger.description = 'Menampilkan lokasi gempa sekarang'
        return res.status(200).send(true);
    });

    app.get('/cuaca', (req, res) => {
        // #swagger.tags = ['Forecast']
        // #swagger.description = 'Menampilkan cuaca saat ini'
        /* #swagger.parameters['day'] = {
            type: 'integer',
            description: 'Optional. Jika tidak di isi maka menampilkan Kemaren sampai Besok. Nilai 1 = Kemaren, 2 = Kemaren sampai Hari ini dan 3 = Kemaren sampai Besok'
        } */
        /* #swagger.parameters['kabupaten'] = {
            required: true,
            description: 'Nilai kabupaten bisa didapatkan di /kabupaten-kota'
        } */
        const { day, kabupaten } = req.query;
        res.status(200).send(true);
    });

    app.get('/arti-nama', (req, res) => {
        // #swagger.tags = ['Forecast']
        // #swagger.description = 'Menampilkan hasil arti sebuah nama'
        // #swagger.parameters['nama'] = { required: true }
        const { nama } = req.query;
        res.status(200).send(true);
    });

    app.get('/pasangan', (req, res) => {
        // #swagger.tags = ['Forecast']
        // #swagger.description = 'Menampilkan hasil ramalan antara pasangan menggunakan nama'
        // #swagger.parameters['nama1'] = { required: true }
        // #swagger.parameters['nama2'] = { required: true }
        const { nama1, nama2 } = req.query;
        res.status(200).send(true);
    });

    app.get('/pekerjaan', (req, res) => {
        // #swagger.tags = ['Forecast']
        // #swagger.description = 'Menampilkan hasil ramalan pekeejaan berdasarkan tanggal'
        /* #swagger.parameters['tanggal'] = {
            required: true,
            description: 'Format tanggal DD-MM-YYYY. Contoh 11-12-2000'
        } */
        const { tanggal } = req.query;
        res.status(200).send(true);
    });

    app.get('/penyakit', (req, res) => {
        // #swagger.tags = ['Forecast']
        // #swagger.description = 'Menampilkan hasil ramalan penyakit berdasarkan tanggal'
        /* #swagger.parameters['tanggal'] = {
            required: true,
            description: 'Format tanggal DD-MM-YYYY. Contoh 11-12-2000'
        } */
        const { tanggal } = req.query;
        res.status(200).send(true);
    });
};
