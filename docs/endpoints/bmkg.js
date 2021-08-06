/* eslint-disable arrow-body-style */
module.exports = (app) => {
    app.get('/info-gempa', (req, res) => {
        // #swagger.tags = ['BMKG']
        // #swagger.description = 'Menampilkan lokasi gempa sekarang'
        return res.status(200).send(true)
    })

    app.get('/cuaca', (req, res) => res.status(200).send(true))
}
