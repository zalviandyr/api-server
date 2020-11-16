const ytdl = require('ytdl-core')

// my library
const { formatBytes, getVideoID } = require('./helpers')

const endpoint = {
    ytVideo: (hostname, query) => new Promise((resolve) => {
        const url = query.url
        const ytVideo = ytdl(url, { filter: (format) => format.container === 'mp4' })
        // function callback(info, format, _size) {
        //     // check video id
        //     const videoID = getVideoID(url)
        //     const videoTitle = info.videoDetails.title.replace(/[^a-zA-Z0-9&()]/g, ' ').trim()

        //     const result = {
        //         title: videoTitle,
        //         ext: format.container,
        //         size: formatBytes(_size),
        //         url: hostname + `/api/yt-video/download?id=${videoID}&title=${videoTitle}&ext=${format.container}`,
        //     }

        //     resolve(result)
        // }

        ytVideo.on('info', (info, format) => {
            ytVideo.on('progress', (chunkSize, downloaded, size) => {
                // check video id
                const videoID = getVideoID(url)
                const videoTitle = info.videoDetails.title.replace(/[^a-zA-Z0-9&()]/g, ' ').trim()

                const result = {
                    title: videoTitle,
                    ext: format.container,
                    size: formatBytes(size),
                    url: hostname + `/api/yt-video/download?id=${videoID}&title=${videoTitle}&ext=${format.container}`,
                }

                resolve(result)
                // ytVideo.destroy()
                // callback(info, format, size)
            })
        })
    }),
}

module.exports = endpoint
