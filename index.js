const express = require('express')
const ytdl = require('ytdl-core')

// my library
const endpoint = require('./lib/endpoint')

const app = express()
const api = express.Router()
const port = process.env.PORT || 4000

api.get('/yt-video', (req, res) => {
    endpoint.ytVideo(req.protocol, req.headers.host, req.query)
        .then((result) => {
            res.send(result)
        }).catch((err) => { console.log(err) })
})

api.get('/yt-audio', (req, res) => {
    endpoint.ytAudio(req.protocol, req.headers.host, req.query)
        .then((result) => {
            res.send(result)
        }).catch((err) => { console.log(err) })
})

api.get('/yt-search', (req, res) => {
    endpoint.ytSearch(req.query)
        .then((result) => {
            res.send(result)
        }).catch((err) => res.status(err.status_code).json(err))
})

api.get('/fb-video', (req, res) => {
    endpoint.fbVideo(req.query)
        .then((result) => {
            res.send(result)
        }).catch((err) => res.status(err.status_code).json(err))
})

api.get('/ig-profile', (req, res) => {
    endpoint.igProfile(req.query)
        .then((result) => {
            res.send(result)
        }).catch((err) => res.status(err.status_code).json(err))
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

api.get('/info-gempa', (req, res) => {
    endpoint.infoGempa()
        .then((result) => {
            res.send(result)
        }).catch((err) => res.status(err.status_code).json(err))
})

api.get('/cuaca', (req, res) => {
    endpoint.cuaca(req.query)
        .then((result) => {
            res.send(result)
        }).catch((err) => res.status(err.status_code).json(err))
})

api.get('/kabupaten-kota', (req, res) => {
    endpoint.kabupatenKota(req.query)
        .then((result) => {
            res.send(result)
        }).catch((err) => res.status(err.status_code).json(err))
})

api.get('/jadwal-sholat', (req, res) => {
    endpoint.jadwalSholat(req.query)
        .then((result) => {
            res.send(result)
        }).catch((err) => res.status(err.status_code).json(err))
})

api.get('/covid-indonesia', (req, res) => {
    endpoint.covidIndonesia(req.query)
        .then((result) => {
            res.send(result)
        }).catch((err) => res.status(err.status_code).json(err))
})

api.get('/quote-maker', (req, res) => {
    endpoint.quoteMaker(req.query)
        .then((result) => {
            res.send(result)
        }).catch((err) => res.status(err.status_code).json(err))
})

api.get('/lewd', (req, res) => {
    endpoint.lewd(req.query)
        .then((result) => {
            res.send(result)
        }).catch((err) => res.status(err.status_code).json(err))
})

api.get('/speech', (req, res) => {
    endpoint.speech(req.query)
        .then((result) => {
            res.header('Content-Disposition', 'attachment; filename=audio.wav')
            result.pipe(res)
        }).catch((err) => res.status(err.status_code).json(err))
})

// base url
app.enable('trust proxy')
app.use('/api', api)
app.get('/', (req, res) => {
    res.send('API Server by Zukron Alviandy R')
})

// start server
app.listen(port, () => {
    console.log(`server started at port: ${port}`)
})
