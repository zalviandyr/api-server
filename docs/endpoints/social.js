/* eslint-disable no-unused-vars */
module.exports = (app) => {
    app.get('/fb-video', (req, res) => {
        // #swagger.tags = ['Social']
        // #swagger.description = 'Mengkonversikan video facebook yang publik menjadi link download'
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

    app.get('/ig', (req, res) => {
        // #swagger.tags = ['Social']
        // #swagger.description = 'Mengkonversikan video atau gambar instagram yang publik menjadi link download'
        // #swagger.parameters['url'] = { required: true }
        const { url } = req.query;
        res.status(200).send(true);
    });
};
