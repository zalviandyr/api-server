const { Readable } = require('stream')
const url = require('url')
const toArray = require('stream-to-array')
const Lame = require('node-lame').Lame
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path
const ffmpeg = require('fluent-ffmpeg')

const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const size = ['Bytes', 'KB', 'MB', 'GB', 'TB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))
    const temp = parseFloat((bytes / k ** i).toFixed(dm))

    return temp + ' ' + size[i]
}
exports.formatBytes = formatBytes

const getVideoID = (link) => {
    const idRegex = /^[a-zA-Z0-9-_]{11}$/;
    const validQueryDomains = new Set([
        'youtube.com',
        'www.youtube.com',
        'm.youtube.com',
        'music.youtube.com',
        'gaming.youtube.com',
    ]);
    const validPathDomains = /^https?:\/\/(youtu\.be\/|(www\.)?youtube.com\/(embed|v)\/)/;

    const parsed = url.parse(link, true);
    let id = parsed.query.v;
    if (validPathDomains.test(link) && !id) {
        const paths = parsed.pathname.split('/');
        id = paths[paths.length - 1];
    } else if (parsed.hostname && !validQueryDomains.has(parsed.hostname)) {
        throw Error('Not a YouTube domain');
    }
    if (!id) {
        throw Error(`No video id found: ${link}`);
    }
    id = id.substring(0, 11);
    if (!idRegex.test(id)) {
        throw TypeError(`Video id (${id}) does not match expected format (${idRegex.toString()})`);
    }

    return id;
}
exports.getVideoID = getVideoID

const toCamelCase = (str) => str
    .replace(/\s(.)/g, ($1) => $1.toUpperCase())
    .replace(/\s/g, '')
    .replace(/^(.)/, ($1) => $1.toLowerCase())

exports.toCamelCase = toCamelCase

const errorResponse = (statusCode, message) => ({ status_code: statusCode, message })
exports.errorResponse = errorResponse

const toMp3 = (streamAnyAudio) => new Promise((resolve, rejects) => {
    // stream to buffer
    toArray(streamAnyAudio)
        .then((parts) => {
            const buffers = parts.map((part) => (Buffer.from(part)))
            const buffer = Buffer.concat(buffers)

            // buffer any audio to buffer mp3
            const encoder = new Lame({
                output: 'buffer',
                bitrate: 192,
            }).setBuffer(buffer)

            encoder.encode()
                .then(() => {
                    // buffer to stream
                    const readable = Readable.from(encoder.getBuffer())
                    resolve(readable)
                }).catch((err) => {
                    rejects(err)
                })
        })
})
exports.toMp3 = toMp3

const videoToMp3 = (streamAnyVideo) => new Promise((resolve, rejects) => {
    ffmpeg.setFfmpegPath(ffmpegPath)

    const result = ffmpeg()
        .input(streamAnyVideo)
        .format('mp3')
        .on('error', (err) => {
            rejects(err)
        })

    resolve(result)
})
exports.videoToMp3 = videoToMp3
