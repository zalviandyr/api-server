module.exports = (app) => {
    app.get('/muslim/jadwal-shalat', (req, res) => {
        // #swagger.tags = ['Religion / Muslim']
        // #swagger.description = 'Menampilkan list kota yang tersedia'
        res.status(200).send(true);
    });

    app.get('/muslim/jadwal-shalat/:kota', (req, res) => {
        // #swagger.tags = ['Religion / Muslim']
        // #swagger.description = 'Menampilkan jadwal sholat sesuai kota yang ada'
        res.status(200).send(true);
    });

    app.get('/muslim/bacaan-shalat', (req, res) => {
        // #swagger.tags = ['Religion / Muslim']
        // #swagger.description = 'Menampilkan bacaan shalat'
        res.status(200).send(true);
    })

    app.get('/muslim/random/ayat', (req, res) => {
        // #swagger.tags = ['Religion / Muslim']
        // #swagger.description = 'Menampilkan satu ayat random di quran'
        res.status(200).send(true);
    });

    app.get('/muslim/doa/ayat-kursi', (req, res) => {
        // #swagger.tags = ['Religion / Muslim']
        // #swagger.description = 'Menampilkan doa ayat kursi'
        res.status(200).send(true);
    })

    app.get('/muslim/doa/harian', (req, res) => {
        // #swagger.tags = ['Religion / Muslim']
        // #swagger.description = 'Menampilkan doa harian'
        res.status(200).send(true);
    })

    app.get('/muslim/doa/tahlil', (req, res) => {
        // #swagger.tags = ['Religion / Muslim']
        // #swagger.description = 'Menampilkan doa tahlil'
        res.status(200).send(true);
    })

    app.get('/muslim/doa/wirid', (req, res) => {
        // #swagger.tags = ['Religion / Muslim']
        // #swagger.description = 'Menampilkan doa wirid'
        res.status(200).send(true);
    })

    app.get('/muslim/quran', (req, res) => {
        // #swagger.tags = ['Religion / Muslim']
        // #swagger.description = 'Menampilkan list surat'
        res.status(200).send(true);
    });

    app.get('/muslim/quran/:surat', (req, res) => {
        // #swagger.tags = ['Religion / Muslim']
        // #swagger.description = 'Menampilkan detail surat'
        /* #swagger.parameters['surat'] = {
            description: 'Nomor surat',
        } */
        res.status(200).send(true);
    });

    app.get('/muslim/quran/:surat/:ayat', (req, res) => {
        // #swagger.tags = ['Religion / Muslim']
        // #swagger.description = 'Menampilkan surat berdasarkan ayat'
        /* #swagger.parameters['surat'] = {
            description: 'Nomor surat',
        } */
        /* #swagger.parameters['ayat'] = {
            description: 'Nomor ayat. Contoh, 1-7'
        } */
        res.status(200).send(true);
    });
}