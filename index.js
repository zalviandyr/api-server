const fs = require('fs')
const express = require('express')
const ytdl = require('ytdl-core')

// my library
const endpoint = require('./lib/endpoint')
const { formatBytes } = require('./lib/helpers')

const app = express()
const api = express.Router()
const port = process.env.PORT || 4000

api.get('/yt-video', (req, res) => {
    endpoint.ytVideo(req.protocol, req.headers.host, req.query)
        .then((result) => {
            res.send(result)
        }).catch((err) => {
            res.send(err.message)
        })
})

api.get('/yt-audio', (req, res) => {
    endpoint.ytAudio(req.protocol, req.headers.host, req.query)
        .then((result) => {
            res.send(result)
        }).catch((err) => {
            res.send(err.message)
        })
})

api.get('/yt-video/download', (req, res) => {
    const videoID = req.query.id
    const title = req.query.title
    const ext = req.query.ext
    const fileName = title + '.' + ext
    res.header('Content-Disposition', `attachment; filename=${fileName}`)

    const url = `https://www.youtube.com/watch?v=${videoID}`
    ytdl(url, { filter: (_format) => _format.container === 'mp4' })
        .pipe(res)
})

api.get('/yt-audio/download', (req, res) => {
    const videoID = req.query.id
    const title = req.query.title
    const ext = req.query.ext
    const fileName = title + '.' + ext
    res.header('Content-Disposition', `attachment; filename=${fileName}`)

    const url = `https://www.youtube.com/watch?v=${videoID}`
    ytdl(url, { quality: 'highestaudio', filter: 'audioonly' })
        .pipe(res)
})

api.get('/temp', (req, res) => {
    console.log(req.protocol)
    res.send(formatBytes(50000000).toString())
})

// base url
app.enable('trust proxy')
app.use('/api', api)
app.get('/', (req, res) => {
    res.send('Whatsapp bot api by Zukron Alviandy R')
})

// start server
app.listen(port, () => {
    // TODO delete this line
    fs.mkdirSync('./storage', { recursive: true })
    console.log(`server started at port: ${port}`)
})
