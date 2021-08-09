module.exports = (app) => {
    app.get('/tiktok', (req, res) => {
        // #swagger.tags = ['Social']
        // #swagger.description = 'Mengkonversi video tiktok berdasarkan url menjadi download link'
        // #swagger.parameters['url'] = { required: true }
        const { url } = req.query;
        res.status(200).send(true);
    });

    app.get('/ig', (req, res) => {
        // #swagger.tags = ['Social']
        // #swagger.description = 'Mengkonversikan video atau gambar instagram yang publik menjadi link download'
        // #swagger.parameters['url'] = { required: true }
        const { url } = req.query;
        res.status(200).send(true);
    });

    app.get('/ig-profile', (req, res) => {
        // #swagger.tags = ['Social']
        // #swagger.description = 'Mendapatkan informasi berdasarkan username'
        // #swagger.parameters['username'] = { required: true }
        const { username } = req.query;
        res.status(200).send(true);
    });

    app.get('/fb-video', (req, res) => {
        // #swagger.tags = ['Social']
        // #swagger.description = 'Mengkonversikan video facebook yang publik menjadi link download'
        // #swagger.parameters['url'] = { required: true }
        const { url } = req.query;
        res.status(200).send(true);
    });

    app.get('/yt-audio', (req, res) => {
        // #swagger.tags = ['Social']
        // #swagger.description = 'Mengkonversikan link youtube menjadi link audio yang bisa didownload'
        // #swagger.parameters['url'] = { required: true }
        const { url } = req.query;
        res.status(200).send(true);
    });

    app.get('/yt-video', (req, res) => {
        // #swagger.tags = ['Social']
        // #swagger.description = 'Mengkonversikan link youtube menjadi link video yang bisa didownload'
        // #swagger.parameters['url'] = { required: true }
        const { url } = req.query;
        res.status(200).send(true);
    });

    app.get('/yt-search', (req, res) => {
        // #swagger.tags = ['Social']
        // #swagger.description = 'Menampilkan hasil sesuai kata kunci'
        // #swagger.parameters['search'] = { required: true }
        const { search } = req.query;
        res.status(200).send(true);
    });
};
