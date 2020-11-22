const { transform } = require('camaro')
const { slugify } = require('transliteration')
const axios = require('axios')
const ytdl = require('ytdl-core')
const fbVideos = require('fbvideos')
const fs = require('fs')
const youtubeSearch = require('youtube-search')
const akaneko = require('akaneko')
const trev = require('trev')
const translate = require('@k3rn31p4nic/google-translate-api')
const urlParse = require('url').parse
const puppeteer = require('puppeteer')

// my library
const {
    urlBmkg, authentication, filePath, puppeteerValues,
} = require('./helpers/values')
const {
    formatBytes, getVideoID, toCamelCase, errorResponse, toMp3,
} = require('./helpers/utilities')

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
        ytAudio.on('info', (info) => {
            ytAudio.on('progress', (chunkSize, downloaded, size) => {
                // check video id
                const videoID = getVideoID(url)
                const videoTitle = info.videoDetails.title

                const result = {
                    title: videoTitle,
                    size: formatBytes(size),
                    url: protocol + '://' + hostname + `/api/yt-audio/download?id=${videoID}&title=${slugify(videoTitle)}`,
                }

                resolve(result)
            })
        })
    }),

    ytSearch: (query) => new Promise((resolve, rejects) => {
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
            rejects(errorResponse(400, 'Silahkan input query search, contoh: ?search=mitis moments'))
        }
    }),

    fbVideo: (query) => new Promise((resolve, rejects) => {
        if (query.url) {
            const url = query.url

            fbVideos.low(url)
                .then((result) => {
                    if (result.url) {
                        resolve({ url: result.url })
                    } else {
                        rejects(errorResponse(400, result))
                    }
                })
        } else {
            rejects(errorResponse(400, 'Silahkan input query url, contoh: ?url=https://facebook.com/video'))
        }
    }),

    igProfile: (query) => new Promise((resolve, rejects) => {
        if (query.username) {
            const username = query.username
            const url = `https://igblade.com/api/v2/accounts/${username}`

            axios({
                url,
                headers: { Authorization: `Bearer ${authentication.igBlade.bearer}` },
                responseType: 'json',
            }).then((result) => {
                const profile = result.data.profile
                const response = {
                    username: profile.username,
                    name: profile.name,
                    biography: profile.biography,
                    profile_picture: profile.profile_picture,
                    is_private: profile.is_private,
                    is_verified: profile.is_verified,
                    follower: profile.follower_count,
                    following: profile.following_count,
                    external_url: profile.external_url,
                    posts: profile.media_count,
                }

                resolve(response)
            }).catch((err) => {
                rejects(errorResponse(500, err.message))
            })
        } else {
            rejects(errorResponse(400, 'Silahkan input query username, contoh: ?username=zukronalviandy11'))
        }
    }),

    infoGempa: () => new Promise((resolve, rejects) => {
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
            rejects(errorResponse(500, err.message))
        })
    }),

    cuaca: (query) => new Promise((resolve, rejects) => {
        if (query.kabupaten) {
            const kabupaten = query.kabupaten.toLowerCase().replace(/[^a-z\s]/g, '')
            const day = query.day

            // read file kabupaten json
            const path = filePath.kabupateKota
            fs.readFile(path, 'utf8', (err, data) => {
                if (err) {
                    rejects(errorResponse(500, err.message))
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
                                        let dayArray = { start: 0, end: 12 }
                                        if (['1', '2', '3'].includes(day)) {
                                            if (day === '1') dayArray = { start: 0, end: 4 }
                                            if (day === '2') dayArray = { start: 0, end: 8 }
                                            if (day === '3') dayArray = { start: 0, end: 12 }
                                        }

                                        for (let times = dayArray.start; times < dayArray.end; times++) {
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
                                rejects(errorResponse(500, axiosErr.message))
                            })
                        } else {
                            found = false
                        }

                        break
                    }
                }

                if (!found) {
                    rejects(errorResponse(400, 'Kabupaten atau kota tidak ada'))
                    rejects(errorResponse)
                }
            })
        } else {
            rejects(errorResponse(400, 'Silahkan masukkan query kabupaten, contoh ?kabupaten=kab bungo'))
        }
    }),

    kabupatenKota: (query) => new Promise((resolve, rejects) => {
        const path = filePath.kabupateKota

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
                    rejects(errorResponse(400, 'Provinsi tidak ada'))
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
                rejects(errorResponse(500, err.message))
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
                rejects(errorResponse(500, err.message))
            })
        }
    }),

    covidIndonesia: () => new Promise((resolve, rejects) => {
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
            rejects(errorResponse(500, err.message))
        })
    }),

    quoteMaker: (query) => new Promise((resolve, rejects) => {
        if (query.author && query.quote) {
            const author = query.author
            const quote = query.quote
            const url = `https://terhambar.com/aw/qts/?kata=${quote}&author=${author}&tipe=random`

            axios({
                url,
                responseType: 'json',
            }).then((result) => {
                resolve(result.data)
            }).catch((err) => {
                rejects(errorResponse(500, err.message))
            })
        } else {
            rejects(errorResponse(400, 'Silahkan masukkan query author dan quote, contoh: ?author=sae kadal&quote=wayahe wayahe'))
        }
    }),

    animePic: (query) => new Promise((resolve, rejects) => {
        if (query.genre) {
            const genre = query.genre

            const genreList = [
                'neko', 'ass', 'bdsm', 'blowjob', 'cum',
                'doujin', 'feet', 'femdom', 'hentai',
                'netorare', 'maid', 'orgy', 'panties',
                'pussy', 'uglybastard', 'uniform', 'random',
                'wallpaper']

            if (genreList.includes(genre)) {
                let type

                if (genre === 'neko') type = akaneko.neko()
                if (genre === 'ass') type = akaneko.nsfw.ass()
                if (genre === 'bdsm') type = akaneko.nsfw.bdsm()
                if (genre === 'blowjob') type = akaneko.nsfw.blowjob()
                if (genre === 'cum') type = akaneko.nsfw.cum()
                if (genre === 'doujin') type = akaneko.nsfw.doujin()
                if (genre === 'feet') type = akaneko.nsfw.feet()
                if (genre === 'femdom') type = akaneko.nsfw.femdom()
                if (genre === 'hentai') type = akaneko.nsfw.hentai()
                if (genre === 'netorare') type = akaneko.nsfw.netorare()
                if (genre === 'maid') type = akaneko.nsfw.maid()
                if (genre === 'orgy') type = akaneko.nsfw.orgy()
                if (genre === 'panties') type = akaneko.nsfw.panties()
                if (genre === 'pussy') type = akaneko.nsfw.pussy()
                if (genre === 'uglybastard') type = akaneko.nsfw.uglyBastard()
                if (genre === 'uniform') type = akaneko.nsfw.uniform()
                if (genre === 'wallpaper') type = akaneko.nsfw.mobileWallpapers()
                if (genre === 'random') type = trev.nsfw.hentai()

                type.then((url) => {
                    if (genre === 'random') {
                        resolve({ url: url.media })
                    } else {
                        resolve({ url })
                    }
                }).catch((err) => {
                    rejects(errorResponse(500, err.message))
                })
            } else {
                rejects(errorResponse(400, 'Genre tidak ada'))
            }
        } else {
            rejects(errorResponse(400, 'Silahkan input query genre, contoh ?genre=random'))
        }
    }),

    meme: () => new Promise((resolve, rejects) => {
        const url = 'https://meme-api.herokuapp.com/gimme'

        axios({
            url,
            responseType: 'json',
        }).then((result) => {
            const response = {
                post_link: result.data.postLink,
                subreddit: result.data.subreddit,
                title: result.data.title,
                author: result.data.author,
                url: result.data.url,
            }
            resolve(response)
        }).catch((err) => {
            rejects(errorResponse(500, err.message))
        })
    }),

    speech: (query) => new Promise((resolve, rejects) => {
        if (query.lang && query.text) {
            const lang = query.lang
            const text = query.text
            const langList = [
                'en', 'kr', 'jp', 'es',
                'fr', 'br', 'cn', 'nl',
                'ar', 'it', 'de']

            if (langList.includes(lang)) {
                let url
                if (lang === 'en') {
                    url = 'https://api.us-south.text-to-speech.watson.cloud.ibm.com/instances/ce3d3b7b-679f-436f-9b2a-1873729665e0/v1/synthesize?voice=en-US_EmilyV3Voice'
                } else if (lang === 'kr') {
                    url = 'https://api.us-south.text-to-speech.watson.cloud.ibm.com/instances/ce3d3b7b-679f-436f-9b2a-1873729665e0/v1/synthesize?voice=ko-KR_YunaVoice'
                } else if (lang === 'jp') {
                    url = 'https://api.us-south.text-to-speech.watson.cloud.ibm.com/instances/ce3d3b7b-679f-436f-9b2a-1873729665e0/v1/synthesize?voice=ja-JP_EmiV3Voice'
                } else if (lang === 'es') {
                    url = 'https://api.us-south.text-to-speech.watson.cloud.ibm.com/instances/ce3d3b7b-679f-436f-9b2a-1873729665e0/v1/synthesize?voice=es-ES_LauraV3Voice'
                } else if (lang === 'fr') {
                    url = 'https://api.us-south.text-to-speech.watson.cloud.ibm.com/instances/ce3d3b7b-679f-436f-9b2a-1873729665e0/v1/synthesize?voice=fr-FR_ReneeV3Voice'
                } else if (lang === 'br') {
                    url = 'https://api.us-south.text-to-speech.watson.cloud.ibm.com/instances/ce3d3b7b-679f-436f-9b2a-1873729665e0/v1/synthesize?voice=pt-BR_IsabelaV3Voice'
                } else if (lang === 'cn') {
                    url = 'https://api.us-south.text-to-speech.watson.cloud.ibm.com/instances/ce3d3b7b-679f-436f-9b2a-1873729665e0/v1/synthesize?voice=zh-CN_ZhangJingVoice'
                } else if (lang === 'nl') {
                    url = 'https://api.us-south.text-to-speech.watson.cloud.ibm.com/instances/ce3d3b7b-679f-436f-9b2a-1873729665e0/v1/synthesize?voice=nl-NL_EmmaVoice'
                } else if (lang === 'ar') {
                    url = 'https://api.us-south.text-to-speech.watson.cloud.ibm.com/instances/ce3d3b7b-679f-436f-9b2a-1873729665e0/v1/synthesize?voice=ar-AR_OmarVoice'
                } else if (lang === 'it') {
                    url = 'https://api.us-south.text-to-speech.watson.cloud.ibm.com/instances/ce3d3b7b-679f-436f-9b2a-1873729665e0/v1/synthesize?voice=it-IT_FrancescaV3Voice'
                } else if (lang === 'de') {
                    url = 'https://api.us-south.text-to-speech.watson.cloud.ibm.com/instances/ce3d3b7b-679f-436f-9b2a-1873729665e0/v1/synthesize?voice=de-DE_ErikaV3Voice'
                }

                axios({
                    url,
                    method: 'post',
                    headers: {
                        Authorization: 'Basic ' + Buffer.from(authentication.ibm.username + ':' + authentication.ibm.password).toString('base64'),
                        Accept: 'audio/wav',
                        'Content-Type': 'application/json',
                    },
                    data: { text },
                    responseType: 'stream',
                }).then((result) => {
                    toMp3(result.data)
                        .then((streamMp3) => {
                            resolve(streamMp3)
                        }).catch((err) => {
                            rejects(errorResponse(500, err.message))
                        })
                }).catch((err) => {
                    rejects(errorResponse(500, err.message))
                })
            } else {
                rejects(errorResponse(400, 'Lang tidak ada'))
            }
        } else {
            rejects(errorResponse(400, 'Silahkan input query lang dan text, contoh ?lang=en&text=hai'))
        }
    }),

    translate: (query) => new Promise((resolve, rejects) => {
        if (query.text) {
            const text = query.text
            translate(text, { to: 'id' })
                .then((result) => {
                    const response = {
                        text: result.text,
                        typo: result.from.text.value,
                        from: result.from.language.iso,
                        to: 'id',
                    }
                    resolve(response)
                }).catch((err) => {
                    rejects(errorResponse(500, err.message))
                })
        } else {
            rejects(errorResponse(400, 'Silahkan input query text, contoh: ?text=こんにちは'))
        }
    }),

    quote: (query) => new Promise((resolve, rejects) => {
        if (query.type) {
            const pathQuotes = filePath.quotes
            const type = query.type
            const typeList = ['random', 'kanye']

            if (typeList.includes(type)) {
                const response = { text_en: '', text_id: '', author: '' }
                if (type === 'random') {
                    fs.readFile(pathQuotes, 'utf8', (err, result) => {
                        if (err) {
                            rejects(errorResponse(500, err.message))
                            return
                        }

                        const quoteJson = JSON.parse(result)
                        const random = Math.floor(Math.random() * quoteJson.length)

                        translate(quoteJson[random].text, { to: 'id' })
                            .then((translateResult) => {
                                response.text_en = quoteJson[random].text
                                response.text_id = translateResult.text
                                response.author = quoteJson[random].author

                                resolve(response)
                            })
                    })
                }

                if (type === 'kanye') {
                    const url = 'https://api.kanye.rest/'
                    axios({
                        url,
                        responseType: 'json',
                    }).then((result) => {
                        translate(result.data.quote, { to: 'id' })
                            .then((translateResult) => {
                                response.text_en = result.data.quote
                                response.text_id = translateResult.text
                                response.author = 'Kanye West'

                                resolve(response)
                            })
                    }).catch((err) => {
                        rejects(errorResponse(500, err.message))
                    })
                }
            } else {
                rejects(errorResponse(400, 'Type tidak ada'))
            }
        } else {
            rejects(errorResponse(400, 'Silahkan input type, contoh: ?type=random'))
        }
    }),

    bosan: () => new Promise((resolve, rejects) => {
        const url = 'https://www.boredapi.com/api/activity'

        axios({
            url,
        }).then((result) => {
            const response = {
                activity: result.data.activity,
                type: result.data.type,
            }
            resolve(response)
        }).catch((err) => {
            rejects(errorResponse(500, err.message))
        })
    }),

    kusonime: (query) => new Promise((resolve, rejects) => {
        const search = query.search
        const keyword = search.replace(/ /g, '+')
        const urlKusonime = `https://kusonime.com/?s=${keyword}&post_type=post`;

        (async () => {
            const browser = await puppeteer.launch(puppeteerValues.options)
            const page = await browser.newPage()
            // user agent
            await page.setUserAgent(puppeteerValues.userAgent)

            // get link from first result
            const xpathSearchResult = '//div[@class="venz"]/ul'
            await page.goto(urlKusonime, { waitUntil: 'networkidle0' })
            await page.waitForXPath(xpathSearchResult)
            const [elementSearchResult] = await page.$x(xpathSearchResult)
            const resultUrl = await page.evaluate((element) => {
                // get first link from first result
                const allResult = element.querySelectorAll('div.kover')
                let firstResultUrl

                // check if no result
                if (allResult.length !== 0) {
                    const firstResult = allResult[0]
                    firstResultUrl = firstResult.querySelector('div > div.content > h2 > a').getAttribute('href')
                }

                return firstResultUrl
            }, elementSearchResult)

            // jika tidak ada url ny maka return saja
            if (!resultUrl) {
                rejects(errorResponse(400, 'No result'))
                await browser.close()

                return
            }

            // lets scrape it
            const xpathMainPage = '//div[@class="venser"]'
            await page.goto(resultUrl)
            await page.waitForXPath(xpathMainPage)
            const [elementMainPage] = await page.$x(xpathMainPage)

            const result = await page.evaluate((element) => {
                const thumbs = element.querySelector('div.post-thumb > img').getAttribute('src')
                const title = element.querySelector('div.post-thumb > h1').innerText
                // output Japanese: bla bla bla
                const titleJp = element.querySelector('div.venutama > div.lexot > div.info > p:nth-child(1)').innerText.split(':')[1].trim()
                // output Genre: bla, bla, bla
                const genres = element.querySelectorAll('div.venutama > div.lexot > div.info > p:nth-child(2) > a')
                const genre = (() => {
                    const temp = []
                    for (let i = 0; i < genres.length; i++) {
                        temp.push(genres[i].innerText)
                    }
                    return temp.join(', ')
                })()
                // output Seasons: bla bla bla
                const season = element.querySelector('div.venutama > div.lexot > div.info > p:nth-child(3) > a').innerText
                // output Producers: bla bla bla
                const producer = element.querySelector('div.venutama > div.lexot > div.info > p:nth-child(4)').innerText.split(':')[1].trim()
                // output Type: bla bla bla
                const type = element.querySelector('div.venutama > div.lexot > div.info > p:nth-child(5)').innerText.split(':')[1].trim()
                // output Status: bla bla bla
                const status = element.querySelector('div.venutama > div.lexot > div.info > p:nth-child(6)').innerText.split(':')[1].trim()
                // output Total Episode: bla bla bla
                const totalEpisode = element.querySelector('div.venutama > div.lexot > div.info > p:nth-child(7)').innerText.split(':')[1].trim()
                // output Score: bla bla bla
                const score = element.querySelector('div.venutama > div.lexot > div.info > p:nth-child(8)').innerText.split(':')[1].trim()
                // output Duration: bla bla bla
                const duration = element.querySelector('div.venutama > div.lexot > div.info > p:nth-child(9)').innerText.split(':')[1].trim()
                // output Released On: bla bla bla
                const releasedOn = element.querySelector('div.venutama > div.lexot > div.info > p:nth-child(10)').innerText.split(':')[1].trim()
                // get description
                const descriptions = element.querySelectorAll('div.venutama > div.lexot > p')
                const description = (() => {
                    const temp = []
                    // -3 karena 3 terahir sampah, isi cuman line break dan text tanda download
                    for (let i = 0; i < (descriptions.length - 3); i++) {
                        temp.push(descriptions[i].innerText)
                    }
                    return temp.join('\n')
                })()

                // get download, jika banyak list download ambil yang paling atas saja [0]
                const downloadBody = element.querySelectorAll('div.venutama > div.lexot > div.dlbod > div.smokeddl')
                const download = (() => {
                    const downloadListResult = []
                    const downloadUrl = downloadBody[0].querySelectorAll('div.smokeurl')

                    // resolution
                    for (let i = 0; i < downloadUrl.length; i++) {
                        // get url
                        const aPerResolutionArray = []
                        const aPerResolution = downloadUrl[i].querySelectorAll('a')

                        for (let j = 0; j < aPerResolution.length; j++) {
                            const downloadLink = aPerResolution[j].getAttribute('href')

                            const perResolution = {
                                download_link: downloadLink,
                                downloader: aPerResolution[j].innerText,
                            }
                            aPerResolutionArray.push(perResolution)
                        }

                        downloadListResult.push({
                            resolution: downloadUrl[i].querySelector('strong').innerText,
                            download_list: aPerResolutionArray,
                        })
                    }

                    return downloadListResult
                })()

                const dataScrape = {
                    thumbs,
                    title,
                    title_jp: titleJp,
                    genre,
                    season,
                    producer,
                    type,
                    status,
                    total_episode: totalEpisode,
                    score,
                    duration,
                    released_on: releasedOn,
                    description,
                    download,
                }
                return dataScrape
            }, elementMainPage)

            // get original url
            for (let i = 0; i < result.download.length; i++) {
                const downloadList = result.download[i].download_list
                for (let j = 0; j < downloadList.length; j++) {
                    const queryData = urlParse(downloadList[j].download_link, { parseQueryString: true }).query

                    // jika query.url ada maka pakai itu
                    // jika tidak ada maka pakai saja yang belum diparsing
                    if (queryData.url) {
                        downloadList[j].download_link = queryData.url
                    }
                }
            }

            await browser.close()
            resolve(result)
        })()
    }),

    artiNama: (query) => new Promise((resolve, rejects) => {
        if (!query.nama) {
            rejects(errorResponse(400, 'Silahkan isi query nama'))
            return
        }

        const nama = query.nama.replace(/ /g, '+')
        const url = `https://www.primbon.com/arti_nama.php?nama1=${nama}&proses=+Submit%21+`;

        (async () => {
            const browser = await puppeteer.launch(puppeteerValues.options)
            const page = await browser.newPage()
            // user agent
            await page.setUserAgent(puppeteerValues.userAgent)

            const xpathResult = '//div[@id="body"]'
            await page.goto(url, { waitUntil: 'networkidle0' })
            await page.waitForXPath(xpathResult)
            const [elementResult] = await page.$x(xpathResult)
            const data = await page.evaluate((element) => element.textContent, elementResult)

            // remove unnecessary data
            const dataTrim = data.split('Nama:')[0].trim().replace('ARTI NAMA', '')
            const dataSplit = dataTrim.split('\n\n')

            const response = {
                arti: dataSplit[0].trim(),
                deskripsi: dataSplit[1].trim(),
            }

            await browser.close()
            resolve(response)
        })()
    }),
}

module.exports = endpoint
