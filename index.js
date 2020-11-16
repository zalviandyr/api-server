const fs = require('fs')
const express = require('express')
const ytdl = require('ytdl-core')

// my library
const endpoint = require('./lib/endpoint')
const { formatBytes, getVideoID } = require('./lib/helpers')

const app = express()
const api = express.Router()
const port = process.env.PORT || 4000

api.get('/yt-video', (req, res) => {
    endpoint.ytVideo(req.headers.host, req.query)
        .then((result) => {
            res.send(result)
        }).catch((err) => {
            res.send(err.message)
        })
})

api.get('/temp', (req, res) => {
    // const url = 'https://www.youtube.com/watch?v=R19uQyfwqhg'
    // const url = 'https://www.youtube.com/watch?v=kUX9sPALG5g'
    try {
        const url = 'https://www.youtube.com/watch?v=kPA@SDg'
        console.log(getVideoID(url))
    } catch (err) {
        console.log(err.message)
    }
    res.send(formatBytes(50000000).toString())
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

// start server
app.use('/api', api)
app.listen(port, () => {
    // TODO delete this line
    fs.mkdirSync('./storage', { recursive: true })
    console.log(`server started at port: ${port}`)
})
