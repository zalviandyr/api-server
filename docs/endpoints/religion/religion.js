module.exports = (app) => {
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
        const { name, chapter, number } = req.query;
        res.status(200).send(true);
    });
};
