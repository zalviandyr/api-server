const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer')

// my library
const endpoint = require('./lib/endpoint')

const app = express()
const api = express.Router()
const port = process.env.PORT || 4000

api.get('/yt-video', (req, res) => {
    endpoint.ytVideo(req.query)
        .then((result) => {
            res.send(result)
        }).catch((err) => res.status(err.status_code).json(err))
})

api.get('/yt-audio', (req, res) => {
    endpoint.ytAudio(req.query)
        .then((result) => {
            res.send(result)
        }).catch((err) => res.status(err.status_code).json(err))
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

api.get('/quran', (req, res) => {
    endpoint.quran()
        .then((result) => {
            res.send(result)
        }).catch((err) => res.status(err.status_code).json(err))
})

api.get('/surat', (req, res) => {
    endpoint.surat(req.query)
        .then((result) => {
            res.send(result)
        }).catch((err) => res.status(err.status_code).json(err))
})

api.get('/alkitab', (req, res) => {
    endpoint.alkitab(req.query)
        .then((result) => {
            res.send(result)
        }).catch((err) => res.status(err.status_code).json(err))
})

api.get('/drakorasia', (req, res) => {
    endpoint.drakorasia(req.query)
        .then((result) => {
            res.send(result)
        }).catch((err) => res.status(err.status_code).json(err))
})

api.get('/lirik', (req, res) => {
    endpoint.lirik(req.query)
        .then((result) => {
            res.send(result)
        }).catch((err) => res.status(err.status_code).json(err))
})

// base url
api.get('/', (req, res) => {
    res.send('API Server by Zukron Alviandy R')
})

// post => application/json
app.use(bodyParser.json({ limit: '10MB' }))
// post => application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false, limit: '10MB' }))
// post => multipart/form-data
app.use(multer().array())
// start server and config
app.enable('trust proxy')
app.use('/api', api)
app.listen(port, 'localhost', () => {
    console.log(`server started at port: ${port}`)
})
