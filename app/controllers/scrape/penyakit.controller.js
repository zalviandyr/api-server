const puppeteer = require('puppeteer')
const moment = require('moment')
const { puppeteerValues } = require('helpers/values')
const { CustomMessage } = require('helpers/CustomMessage')

class PenyakitController {
    constructor(req, res) {
        this.request = req
        this.response = res
    }

    async controller() {
        const { request, response } = this
        let { tanggal } = request.query
        if (!tanggal) {
            return new CustomMessage(response).error({
                status_code: 400,
                message: 'Silahkan isi query tanggal DD-MM-YYYY, contoh: ?tanggal=01-12-2020',
            }, 400)
        }

        // check date is valid
        const m = moment(tanggal, 'DD-MM-YYYY')
        tanggal = tanggal.split('-').map((map) => '' + map)
        const url = 'https://www.primbon.com/cek_potensi_penyakit.htm'

        if (!m.isValid()) {
            return new CustomMessage(response).error({
                status_code: 400,
                message: 'Silahkan isi query tanggal DD-MM-YYYY, contoh: ?tanggal=01-12-2020',
            }, 400)
        }

        const browser = await puppeteer.launch(puppeteerValues.options)
        try {
            const page = await browser.newPage()
            // user agent
            await page.setUserAgent(puppeteerValues.userAgent)

            await page.goto(url, { waitUntil: 'networkidle0' })
            const xpathResult = '//div[@id="body"]/form'
            await page.waitForXPath(xpathResult)
            const [elements] = await page.$x(xpathResult)
            await page.evaluate(async (element, date, month, year) => {
                const comboTanggal = element.querySelector('table > tbody > tr > td:nth-child(1) > select')
                const comboTanggalOptions = comboTanggal.querySelectorAll('option')
                const comboTanggalSelected = [...comboTanggalOptions].find((option) => option.text === date)

                comboTanggalSelected.selected = true

                const comboBulan = element.querySelector('table > tbody > tr > td:nth-child(2) > select')
                const comboBulanOptions = comboBulan.querySelectorAll('option')
                const comboBulanSelected = [...comboBulanOptions].find((option) => option.value === month)

                comboBulanSelected.selected = true

                const inputTahun = element.querySelector('table > tbody > tr > td:nth-child(3) > input')
                inputTahun.value = year

                const submit = element.querySelector('table > tbody > tr > td:nth-child(4) > input')
                submit.click()
            }, elements, tanggal[0], tanggal[1], tanggal[2])

            await page.waitForNavigation()

            const xpathResult2 = '//div[@id="body"]'
            await page.waitForXPath(xpathResult2)
            const [elements2] = await page.$x(xpathResult2)
            const resultResponse = await page.evaluate((element) => {
                const array = element.innerText.split('\n')
                const indexToSplice = array.findIndex((f) => f === 'Sektor yg dianalisa:')
                const getArrayFromIndex = array.splice(indexToSplice, array.length)
                const indexToSplice2 = getArrayFromIndex.findIndex((f) => f.includes('Anda tidak memiliki') || f.includes('Anda memiliki'))
                const getArrayFromIndex2 = getArrayFromIndex.splice(0, (indexToSplice2 + 1)).filter((f) => f !== '')

                const deskripsi = getArrayFromIndex2[getArrayFromIndex2.length - 1]
                const analisa = getArrayFromIndex2.splice(1, getArrayFromIndex2.length - 2)
                const list = element.querySelectorAll('ul > li')
                const listResult = []
                for (let i = 0; i < list.length; i++) {
                    listResult.push(list[i].innerText)
                }

                const result = {
                    analisa,
                    deskripsi,
                    penyakit: listResult,
                }
                return result
            }, elements2)

            return new CustomMessage(response).success(resultResponse, 200, async () => { await browser.close() })
        } catch (err) {
            return new CustomMessage(response).error({
                status_code: 500,
                message: err.message,
            }, 500, async () => { await browser.close() })
        }
    }
}

module.exports = { PenyakitController }
