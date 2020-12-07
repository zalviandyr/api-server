const fs = require('fs').promises
const axios = require('axios')
const { CustomMessage } = require('helpers/CustomMessage')
const { filePath, urlBmkg } = require('helpers/values')
const { toCamelCase } = require('helpers/utilities')
const { transform } = require('camaro')

class CuacaController {
    constructor(req, res) {
        this.request = req
        this.response = res
    }

    async controller() {
        const { request, response } = this
        const { day } = request.query
        let { kabupaten } = request.query

        if (!kabupaten) {
            return new CustomMessage(response).error({
                status_code: 400,
                message: 'Silahkan masukkan query kabupaten, contoh ?kabupaten=kab bungo',
            }, 400)
        }

        // jika kabupaten nilai nya adalah = kabupaten bungo
        // maka ubah ke = kab bungo
        kabupaten = (() => {
            const temp = kabupaten.toLowerCase().replace(/[^a-z\s]/g, '')
            const tempArray = temp.split(' ')
            if (tempArray[0].startsWith('kabupaten')) {
                return 'kab ' + tempArray[1]
            }
            return temp
        })()

        try {
            // read file kabupaten json
            const path = filePath.kabupatenKota
            const data = await fs.readFile(path, 'utf8')

            const dataJson = JSON.parse(data)
            let url
            for (let i = 0; i < dataJson.length; i++) {
                const newArray = dataJson[i].kabupaten_kota.map((cur) => cur.toLowerCase().replace(/[^a-z\s]/g, ''))

                if (newArray.includes(kabupaten)) {
                    const provinsi = toCamelCase(dataJson[i].nama)
                    url = urlBmkg[provinsi]
                }
            }

            if (url) {
                const result = await axios.get(url, { responseType: 'text' })
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
                const tr = await transform(result.data, template)
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
                        return new CustomMessage(response).success(resultDataBmkg)
                    }
                }
            }
        } catch (err) {
            return new CustomMessage(response).error({
                status_code: 500,
                message: err.message,
            }, 500)
        }

        return new CustomMessage(response).error({
            status_code: 404,
            message: 'Kabupaten atau kota tidak ada',
        }, 404)
    }
}

module.exports = { CuacaController }
