const bodyParser = require('body-parser')
const multer = require('multer')

class Module {
    constructor(app) {
        this.app = app
    }

    bodyParser() {
        const { app } = this
        // post => application/json
        app.use(bodyParser.json({ limit: '10MB' }))
        // post => application/x-www-form-urlencoded
        app.use(bodyParser.urlencoded({ extended: false, limit: '10MB' }))
    }

    form() {
        const { app } = this
        // post => multipart/form-data
        app.use(multer().array())
    }
}

module.exports = { Module }
