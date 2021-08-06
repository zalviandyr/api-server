/* eslint-disable no-unused-vars */
module.exports = (app) => {
    app.get('/jadwal-sholat', (req, res) => {
        // #swagger.tags = ['Religion']
        // #swagger.description = 'Menampilkan jadwal sholat sesuai kota yang ada'
        /* #swagger.parameters['kota'] = {
            description: 'Optional. Jika tidak di isi maka akan menampilkan list kota'
        } */
        const { kota } = req.query
        res.status(200).send(true)
    })

    app.get('/quran', (req, res) => {
        // #swagger.tags = ['Religion']
        // #swagger.description = 'Menampilkan satu ayat random di quran'
        res.status(200).send(true)
    })

    app.get('/surat', (req, res) => {
        // #swagger.tags = ['Religion']
        // #swagger.description = 'Menampilkan surat berdasarkan ayat'
        /* #swagger.parameters['surat'] = {
            required: true,
            description: 'Nomor surat',
        } */
        /* #swagger.parameters['ayat'] = {
            description: 'Optional. Jika tidak di isi maka menampilkan deskripsi surat'
        } */
        const { surat, ayat } = req.query
        res.status(200).send(true)
    })

    app.get('/alkitab', (req, res) => {
        // #swagger.tags = ['Religion']
        // #swagger.description = 'Menampilkan alkitab sesuai nama'
        /* #swagger.parameters['name'] = {
            required: true,
        } */
        /* #swagger.parameters['number'] = {
            description: 'Optional. Jika tidak di isi maka akan menampilkan full',
        } */
        /* #swagger.parameters['chapter'] = {
            description: 'Optional. Jika tidak di isi maka akan menampilkan full. Contoh 1-5',
        } */
        const { name, chapter, number } = req.query
        res.status(200).send(true)
    })
}
