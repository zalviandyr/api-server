const express = require('express')
const ytdl = require('ytdl-core')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path
const ffmpeg = require('fluent-ffmpeg')
const bodyParser = require('body-parser')
const multer = require('multer')

// my library
const endpoint = require('./lib/endpoint')
const { errorResponse, videoToMp3 } = require('./lib/helpers/utilities')

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

    ffmpeg.setFfmpegPath(ffmpegPath)

    const url = `https://www.youtube.com/watch?v=${videoID}`
    ytdl(url, { filter: (_format) => _format.container === 'mp4', highWaterMark: 2 ** 16 })
        .pipe(res, { highWaterMark: 2 ** 16 })
})

api.get('/yt-audio/download', (req, res) => {
    const videoID = req.query.id
    const title = req.query.title
    const ext = 'mp3'
    const fileName = title + '.' + ext
    res.header('Content-Disposition', `attachment; filename=${fileName}`)

    const url = `https://www.youtube.com/watch?v=${videoID}`
    const streamYt = ytdl(url, { quality: 'highestaudio', filter: 'audioonly', highWaterMark: 2 ** 16 })

    videoToMp3(streamYt)
        .then((result) => {
            result.pipe(res, { highWaterMark: 2 ** 16 })
        }).catch((err) => {
            res.send(errorResponse(500, err.message))
        })
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

api.get('/anime-pic', (req, res) => {
    endpoint.animePic(req.query)
        .then((result) => {
            res.send(result)
        }).catch((err) => res.status(err.status_code).json(err))
})

api.get('/meme', (req, res) => {
    endpoint.meme()
        .then((result) => {
            res.send(result)
        }).catch((err) => res.status(err.status_code).json(err))
})

api.get('/speech', (req, res) => {
    endpoint.speech(req.query)
        .then((result) => {
            res.header('Content-Disposition', 'attachment; filename=audio.mp3')
            result.pipe(res)
        }).catch((err) => res.status(err.status_code).json(err))
})

api.get('/translate', (req, res) => {
    endpoint.translate(req.query)
        .then((result) => {
            res.send(result)
        }).catch((err) => res.status(err.status_code).json(err))
})

api.get('/quote', (req, res) => {
    endpoint.quote(req.query)
        .then((result) => {
            res.send(result)
        }).catch((err) => res.status(err.status_code).json(err))
})

api.get('/bosan', (req, res) => {
    endpoint.bosan(req.query)
        .then((result) => {
            res.send(result)
        }).catch((err) => res.status(err.status_code).json(err))
})

api.get('/kusonime', (req, res) => {
    endpoint.kusonime(req.query)
        .then((result) => {
            res.send(result)
        }).catch((err) => res.status(err.status_code).json(err))
})

api.get('/arti-nama', (req, res) => {
    endpoint.artiNama(req.query)
        .then((result) => {
            res.send(result)
        }).catch((err) => res.status(err.status_code).json(err))
})

api.get('/pasangan', (req, res) => {
    endpoint.pasangan(req.query)
        .then((result) => {
            res.send(result)
        }).catch((err) => res.status(err.status_code).json(err))
})

api.get('/penyakit', (req, res) => {
    endpoint.penyakit(req.query)
        .then((result) => {
            res.send(result)
        }).catch((err) => res.status(err.status_code).json(err))
})

api.get('/pekerjaan', (req, res) => {
    endpoint.pekerjaan(req.query)
        .then((result) => {
            res.send(result)
        }).catch((err) => res.status(err.status_code).json(err))
})

api.get('/what-anime', (req, res) => {
    endpoint.whatAnime(req.query, req.body, 'get')
        .then((result) => {
            res.send(result)
        }).catch((err) => res.status(err.status_code).json(err))
})

api.post('/what-anime', (req, res) => {
    endpoint.whatAnime(req.query, req.body, 'post')
        .then((result) => {
            res.send(result)
        }).catch((err) => res.status(err.status_code).json(err))
})

// base url
api.get('/', (req, res) => {
    res.send('API Server by Zukron Alviandy R')
})

// post => x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// post => multipart/form-data
app.use(multer().array())
// start server and config
app.enable('trust proxy')
app.use('/api', api)
app.listen(port, 'localhost', () => {
    console.log(`server started at port: ${port}`)
})
