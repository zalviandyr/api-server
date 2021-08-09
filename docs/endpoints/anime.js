module.exports = (app) => {
    app.get('/anime-pic', (req, res) => {
        // #swagger.tags = ['Anime']
        // #swagger.description = 'Menampilkan gambar anime sesuai genre, [List Genre](https://github.com/zalviandyr/api-server#anime-pic-genre-list)'
        /* #swagger.parameters['genre'] = {
            description: 'Optional. Jika tidak diisi maka akan tampil list genre yang tersedia',
        } */
        const { genre } = req.query;
        res.status(200).send(true);
    });
}