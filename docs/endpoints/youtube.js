/* eslint-disable no-unused-vars */
module.exports = (app) => {
    app.get('/yt-audio', (req, res) => {
        // #swagger.tags = ['Youtube']
        // #swagger.description = 'Mengkonversikan link youtube menjadi link audio yang bisa didownload'
        // #swagger.parameters['url'] = { required: true }
        const { url } = req.query;
        res.status(200).send(true);
    });

    app.get('/yt-video', (req, res) => {
        // #swagger.tags = ['Youtube']
        // #swagger.description = 'Mengkonversikan link youtube menjadi link video yang bisa didownload'
        // #swagger.parameters['url'] = { required: true }
        const { url } = req.query;
        res.status(200).send(true);
    });

    app.get('/yt-search', (req, res) => {
        // #swagger.tags = ['Youtube']
        // #swagger.description = 'Menampilkan hasil sesuai kata kunci'
        // #swagger.parameters['search'] = { required: true }
        const { search } = req.query;
        res.status(200).send(true);
    });
};
