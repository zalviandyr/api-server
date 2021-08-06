/* eslint-disable no-unused-vars */
/* eslint-disable arrow-body-style */
module.exports = (app) => {
    app.get('/info-gempa', (req, res) => {
        // #swagger.tags = ['BMKG']
        // #swagger.description = 'Menampilkan lokasi gempa sekarang'
        return res.status(200).send(true);
    });

    app.get('/cuaca', (req, res) => {
        // #swagger.tags = ['BMKG']
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
};
