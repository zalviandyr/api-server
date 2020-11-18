const { transform } = require('camaro')
const { slugify } = require('transliteration')
const axios = require('axios')
const ytdl = require('ytdl-core')
const fs = require('fs')

// my library
const { formatBytes, getVideoID } = require('./helpers/utilities')

const endpoint = {
    ytVideo: (protocol, hostname, query) => new Promise((resolve) => {
        const url = query.url
        const ytVideo = ytdl(url, { filter: (format) => format.container === 'mp4' })
        ytVideo.on('info', (info, format) => {
            ytVideo.on('progress', (chunkSize, downloaded, size) => {
                // check video id
                const videoID = getVideoID(url)
                const videoTitle = info.videoDetails.title

                const result = {
                    title: videoTitle,
                    ext: format.container,
                    size: formatBytes(size),
                    url: protocol + '://' + hostname + `/api/yt-video/download?id=${videoID}&title=${slugify(videoTitle)}&ext=${format.container}`,
                }

                resolve(result)
            })
        })
    }),

    ytAudio: (protocol, hostname, query) => new Promise((resolve) => {
        const url = query.url
        const ytAudio = ytdl(url, { quality: 'highestaudio', filter: 'audioonly' })
        ytAudio.on('info', (info, format) => {
            ytAudio.on('progress', (chunkSize, downloaded, size) => {
                // check video id
                const videoID = getVideoID(url)
                const videoTitle = info.videoDetails.title

                const result = {
                    title: videoTitle,
                    ext: format.container,
                    size: formatBytes(size),
                    url: protocol + '://' + hostname + `/api/yt-audio/download?id=${videoID}&title=${slugify(videoTitle)}&ext=${format.container}`,
                }

                resolve(result)
            })
        })
    }),

    infoGempa: () => new Promise((resolve, reject) => {
        const urlGempa = 'https://data.bmkg.go.id/autogempa.xml'
        axios({
            url: urlGempa,
            responseType: 'text',
        }).then(async (result) => {
            const template = ['Infogempa/gempa', {
                tanggal: 'Tanggal',
                jam: 'Jam',
                lintang: 'Lintang',
                bujur: 'Bujur',
                magnitude: 'Magnitude',
                kedalaman: 'Kedalaman',
                potensi: 'Potensi',
                wilayah1: 'Wilayah1',
                wilayah2: 'Wilayah2',
                wilayah3: 'Wilayah3',
                wilayah4: 'Wilayah4',
                wilayah5: 'Wilayah5',
            }]

            const tr = await transform(result.data, template)
            resolve(tr[0])
        }).catch((err) => {
            reject(err)
        })
    }),

    kabupatenKota: (query) => new Promise((resolve) => {
        const path = './storage/kabupaten-kota.json'

        if (query.provinsi) {
            const provinsi = query.provinsi

            fs.readFile(path, 'utf8', (err, result) => {
                if (err) throw err
                const json = JSON.parse(result)

                for (let i = 0; i < json.length; i++) {
                    if (provinsi.toLowerCase() === json[i].nama.toLowerCase()) {
                        resolve(json[i])
                    }
                }
            })
        } else {
            fs.readFile(path, 'utf8', (err, result) => {
                if (err) throw err
                resolve(JSON.parse(result))
            })
        }
    }),
}

module.exports = endpoint
