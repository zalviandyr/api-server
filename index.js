const express = require('express')

// my library
const endpoint = require('./lib/endpoint')

const app = express()
const port = process.env.PORT || 4000

app.get('/', async (req, res) => {
    await endpoint.ytVideo(req.query)
        .then((result) => {
            res.send(result)
        })
        .catch(() => {
            res.send('gagal')
        })
})

app.get('/temp', (req, res) => {
    res.send('hello world')
})

app.listen(port, () => {
    console.log(`server started at port: ${port}`)
})
