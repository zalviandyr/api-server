const express = require('express')

const router = express.Router()
class Controller {
    // eslint-disable-next-line class-methods-use-this
    get(...args) {
        return router.get(...args)
    }

    // eslint-disable-next-line class-methods-use-this
    post(...args) {
        return router.post(...args)
    }
}

module.exports = { Controller }
