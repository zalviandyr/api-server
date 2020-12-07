require('module-alias/register')
const express = require('express')

const { Route } = require('cores/Route')
const { Module } = require('configs/Module')

class App extends Route {
    init() {
        const port = 4000
        const app = express()

        const mod = new Module(app)
        mod.bodyParser()
        mod.form()

        app.enable('trust proxy')
        app.use('/api', super.init())
        app.listen(port, 'localhost', () => {
            console.log(`server started at port: ${port}`)
        })
    }
}

new App().init()
