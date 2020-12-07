const ffmpeg = require('fluent-ffmpeg')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path

const toCamelCase = (str) => str
    .replace(/\s(.)/g, ($1) => $1.toUpperCase())
    .replace(/\s/g, '')
    .replace(/^(.)/, ($1) => $1.toLowerCase())

exports.toCamelCase = toCamelCase

const toMp3 = (streamData) => new Promise((resolve, rejects) => {
    ffmpeg.setFfmpegPath(ffmpegPath)
    const resultStream = ffmpeg(streamData)
        .toFormat('mp3')
        .on('error', (err) => {
            rejects(err)
        })

    resolve(resultStream)
})
exports.toMp3 = toMp3
