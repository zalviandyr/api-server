module.exports = (app) => {
    app.get('/movie', (req, res) => {
        // #swagger.tags = ['Film']
        // #swagger.description = 'Menampilkan hasil search movie'
        // #swagger.parameters['search'] = { required: true }
        const { search } = req.query;
        res.status(200).send(true);
    });

    app.get('/movie2', (req, res) => {
        // #swagger.tags = ['Film']
        // #swagger.description = 'Menampilkan hasil search movie2'
        // #swagger.parameters['search'] = { required: true }
        const { search } = req.query;
        res.status(200).send(true);
    });

    app.get('/drakorasia', (req, res) => {
        // #swagger.tags = ['Film']
        // #swagger.description = 'Menampilkan hasil search anime di website drakorasia'
        // #swagger.parameters['search'] = { required: true }
        const { search } = req.query;
        res.status(200).send(true);
    });
}