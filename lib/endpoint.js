const { transform } = require('camaro')
const { slugify } = require('transliteration')
const axios = require('axios')
const ytdl = require('ytdl-core')
const fs = require('fs')
const youtubeSearch = require('youtube-search')

// my library
const { formatBytes, getVideoID, toCamelCase } = require('./helpers/utilities')
const { urlBmkg, authentication } = require('./helpers/values')

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

    ytSearch: (query) => new Promise((resolve, rejects) => {
        const errorResponse = { status_code: 0, message: '' }

        if (query.search) {
            const search = query.search
            const options = {
                maxResults: 1,
                type: 'video',
                key: authentication.youtube.apiKey,
            }

            youtubeSearch(search, options, (err, result) => {
                if (err) {
                    errorResponse.status_code = 400
                    errorResponse.message = err.message
                    rejects(errorResponse)
                    return
                }

                const response = {
                    url: result[0].link,
                    thumbs: result[0].thumbnails.high.url,
                    title: result[0].title,
                    description: result[0].description,
                    channel: result[0].channelTitle,
                }

                resolve(response)
            })
        } else {
            errorResponse.status_code = 400
            errorResponse.message = 'Silahkan input query search, contoh: ?search=mitis moments'
            rejects(errorResponse)
        }
    }),

    infoGempa: () => new Promise((resolve, rejects) => {
        const errorResponse = { status_code: 0, message: '' }
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
            errorResponse.status_code = 500
            errorResponse.message = err.message
            rejects(errorResponse)
        })
    }),

    cuaca: (query) => new Promise((resolve, rejects) => {
        const errorResponse = { status_code: 0, message: '' }

        if (query.kabupaten) {
            const kabupaten = query.kabupaten.toLowerCase().replace(/[^a-z\s]/g, '')
            const interval = query.interval

            // read file kabupaten json
            const path = './storage/kabupaten-kota.json'
            fs.readFile(path, 'utf8', (err, data) => {
                if (err) {
                    errorResponse.status_code = 500
                    errorResponse.message = err.message
                    rejects(errorResponse)
                    return
                }

                let found = false
                const dataJson = JSON.parse(data)

                for (let i = 0; i < dataJson.length; i++) {
                    const newArray = dataJson[i].kabupaten_kota.map((cur) => cur.toLowerCase().replace(/[^a-z\s]/g, ''))

                    if (newArray.includes(kabupaten)) {
                        found = true
                        const provinsi = toCamelCase(dataJson[i].nama)
                        const url = urlBmkg[provinsi]

                        if (url) {
                            axios({
                                url,
                                responseType: 'text',
                            }).then(async (response) => {
                                const template = ['/data/forecast/area', {
                                    name1: 'name[@xml:lang="en_US"]',
                                    name2: 'name[@xml:lang="id_ID"]',
                                    humidity: ['parameter[@description="Humidity"]/timerange', {
                                        h: '@h',
                                        datetime: '@datetime',
                                        percentage: 'value',
                                    }],
                                    temperature: ['parameter[@description="Temperature"]/timerange', {
                                        h: '@h',
                                        datetime: '@datetime',
                                        celsius: 'value[@unit="C"]',
                                        fahrenheit: 'value[@unit="F"]',
                                    }],
                                    weather: ['parameter[@description="Weather"]/timerange', {
                                        h: '@h',
                                        datetime: '@datetime',
                                        icon: 'value',
                                    }],
                                }]

                                // get data using kabupaten
                                const tr = await transform(response.data, template)
                                for (let j = 0; j < tr.length; j++) {
                                    const name2 = tr[j].name2.toLowerCase().replace(/[^a-z\s]/g, '')
                                    if (name2 === kabupaten) {
                                        const dataBmkg = tr[j]

                                        const dateTime = dataBmkg.humidity.map((cur) => {
                                            const rawDateTime = cur.datetime
                                            const rawTime = rawDateTime.substring(rawDateTime.length - 4)
                                            const hour = rawTime.substring(0, 2)
                                            const minute = rawTime.substring(2, 4)
                                            const time = hour + ':' + minute

                                            const rawDate = rawDateTime.substring(0, (rawDateTime.length - 4))
                                            const dateOfMonth = rawDate.substring(rawDate.length - 2)
                                            const year = rawDate.substring(0, 4)
                                            const month = rawDate.substring(year.length, (rawDate.length - 2))
                                            const date = year + '-' + month + '-' + dateOfMonth

                                            return date + ' ' + time
                                        })
                                        const humidity = dataBmkg.humidity.map((cur) => cur.percentage + '%')
                                        const temperature = dataBmkg.temperature.map((cur) => ({
                                            celsius: cur.celsius + 'C',
                                            fahrenheit: cur.fahrenheit + 'F',
                                        }))
                                        const weather = dataBmkg.weather.map((cur) => {
                                            let resultWeather
                                            if (['0', '100'].includes(cur.icon)) resultWeather = 'Cerah'
                                            if (['1', '2', '101', '102'].includes(cur.icon)) resultWeather = 'Cerah Berawan'
                                            if (['3', '4', '103', '104'].includes(cur.icon)) resultWeather = 'Berawan'
                                            if (cur.icon === '5') resultWeather = 'Udara kabur'
                                            if (cur.icon === '10') resultWeather = 'Asap'
                                            if (cur.icon === '45') resultWeather = 'Kabut'
                                            if (cur.icon === '60') resultWeather = 'Hujan ringan'
                                            if (cur.icon === '61') resultWeather = 'Hujan sedang'
                                            if (cur.icon === '63') resultWeather = 'Hujan lebat'
                                            if (cur.icon === '80') resultWeather = 'Hujan lokal'
                                            if (['95', '97'].includes(cur.icon)) resultWeather = 'Hujan petir'

                                            return resultWeather
                                        })

                                        // wrap together
                                        const resultData = []
                                        let intervalArray = { start: 0, end: 12 }
                                        if (['kemarin', 'sekarang', 'besok'].includes(interval)) {
                                            if (interval === 'kemarin') intervalArray = { start: 0, end: 4 }
                                            if (interval === 'sekarang') intervalArray = { start: 4, end: 8 }
                                            if (interval === 'besok') intervalArray = { start: 8, end: 12 }
                                        }

                                        for (let times = intervalArray.start; times < intervalArray.end; times++) {
                                            resultData.push({
                                                waktu: dateTime[times],
                                                kelembaban: humidity[times],
                                                temperatur: temperature[times],
                                                cuaca: weather[times],
                                            })
                                        }

                                        const resultDataBmkg = {
                                            nama1: tr[j].name1,
                                            nama2: tr[j].name2,
                                            data: resultData,
                                        }
                                        resolve(resultDataBmkg)
                                        break
                                    }
                                }
                            }).catch((axiosErr) => {
                                throw axiosErr
                            })
                        } else {
                            found = false
                        }

                        break
                    }
                }

                if (!found) {
                    errorResponse.status_code = 400
                    errorResponse.message = 'Kabupaten atau kota tidak ada'
                    rejects(errorResponse)
                }
            })
        } else {
            errorResponse.status_code = 400
            errorResponse.message = 'Silahkan masukkan query kabupaten, contoh ?kabupaten=kab bungo'
            rejects(errorResponse)
        }
    }),

    kabupatenKota: (query) => new Promise((resolve, rejects) => {
        const errorResponse = { status_code: 0, message: '' }
        const path = './storage/kabupaten-kota.json'

        if (query.provinsi) {
            const provinsi = query.provinsi

            fs.readFile(path, 'utf8', (err, result) => {
                if (err) {
                    errorResponse.status_code = 500
                    errorResponse.message = err.message
                    rejects(errorResponse)
                    return
                }

                const json = JSON.parse(result)
                let found = false
                for (let i = 0; i < json.length; i++) {
                    if (provinsi.toLowerCase() === json[i].nama.toLowerCase()) {
                        found = true
                        resolve(json[i])
                    }
                }

                if (!found) {
                    errorResponse.status_code = 400
                    errorResponse.message = 'Provinsi tidak ada'
                    rejects(errorResponse)
                }
            })
        } else {
            fs.readFile(path, 'utf8', (err, result) => {
                if (err) {
                    errorResponse.status_code = 500
                    errorResponse.message = err.message
                    rejects(errorResponse)
                } else {
                    resolve(JSON.parse(result))
                }
            })
        }
    }),

    jadwalSholat: (query) => new Promise((resolve, rejects) => {
        const errorResponse = { status_code: 0, message: '' }

        if (query.kota) {
            const kota = query.kota
            const today = new Date().toISOString().slice(0, 10).split('-')
            const urlSholat = `https://raw.githubusercontent.com/lakuapik/jadwalsholatorg/master/adzan/${kota}/${today[0]}/${today[1]}/${today[2]}.json`

            axios({
                url: urlSholat,
                responseType: 'json',
            }).then((result) => {
                resolve(result.data)
            }).catch((err) => {
                errorResponse.status_code = 500
                errorResponse.message = err.message
                rejects(errorResponse)
            })
        } else {
            const urlKota = 'https://raw.githubusercontent.com/lakuapik/jadwalsholatorg/master/kota.json'

            axios({
                url: urlKota,
                responseType: 'json',
            }).then((result) => {
                const resultKota = {
                    message: 'Silahkan masukan query kota untuk mendapatkan jadwal spesifik, contoh ?kota=muarabungo',
                    kota: result.data,
                }

                resolve(resultKota)
            }).catch((err) => {
                errorResponse.status_code = 500
                errorResponse.message = err.message
                rejects(errorResponse)
            })
        }
    }),

    covidIndonesia: () => new Promise((resolve, rejects) => {
        const errorResponse = { status_code: 0, message: '' }
        const url = 'https://apicovid19indonesia-v2.vercel.app/api/indonesia'

        axios({
            url,
            responseType: 'json',
        }).then((result) => {
            const localDate = new Date(result.data.lastUpdate)
            const lastUpdate = localDate.toLocaleString()

            const resultResponse = {
                positif: result.data.positif,
                dirawat: result.data.dirawat,
                sembuh: result.data.sembuh,
                meninggal: result.data.meninggal,
                last_update: lastUpdate,
            }

            resolve(resultResponse)
        }).catch((err) => {
            errorResponse.status_code = 500
            errorResponse.message = err.message
            rejects(errorResponse)
        })
    }),
}

module.exports = endpoint
