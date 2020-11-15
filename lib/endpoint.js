const ytdl = require('ytdl-core')
const path = require('path')
const fs = require('fs')

const endpoint = {
    ytVideo: async (query) => new Promise((resolve, rejects) => {
        const url = query.url
        const ytvideo = ytdl(url, { filter: (format) => format.container === 'mp4' })
        function callback(info, format, size) {
            // 50 mb
            if (size < 50000000) {
                const temp = ytdl(url, { filter: (_format) => _format.container === 'mp4' })

                const title = info.videoDetails.title.replace(/[^a-zA-Z0-9&()]/g, ' ').trim()
                const downloadPath = `./storage/${title}.${format.container}`
                const absolutePath = path.resolve(downloadPath)
                const file = temp
                    .pipe(fs.createWriteStream(downloadPath))
                    .addListener('finish', () => {
                        file.close()
                        const result = {
                            message: 'success download',
                            result: absolutePath,
                        }
                        resolve(result)
                    })
            } else {
                console.log('max downloadable')
                rejects()
            }
        }

        ytvideo.on('info', (info, format) => {
            ytvideo.on('progress', (chunksize, downloaded, size) => {
                ytvideo.destroy()
                callback(info, format, size)
            })
        })
    }),
}

module.exports = endpoint
