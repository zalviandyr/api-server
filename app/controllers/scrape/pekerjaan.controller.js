const puppeteer = require('puppeteer')
const moment = require('moment')
const { puppeteerValues } = require('helpers/values')
const { CustomMessage } = require('helpers/CustomMessage')

class PekerjaanController {
    constructor(req, res) {
        this.request = req
        this.response = res
    }

    async controller() {
        const { request, response } = this
        const { tanggal } = request.query
        if (!tanggal) {
            return new CustomMessage(response).error({
                status_code: 400,
                message: 'Silahkan isi query tanggal DD-MM-YYYY, contoh: ?tanggal=01-12-2020',
            }, 400)
        }

        // check date is valid
        const m = moment(tanggal, 'DD-MM-YYYY')
        const url = 'https://www.primbon.com/pekerjaan_weton_lahir.htm';

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
            const xpathResult = '//div[@id="body"]/table/tbody'
            await page.waitForXPath(xpathResult)
            const [elements] = await page.$x(xpathResult)
            await page.evaluate(async (element, date, month, year) => {
                const inputTanggal = element.querySelector('tr > td:nth-child(2) > input[name=tgl]')
                inputTanggal.value = '' + date

                const comboBulan = element.querySelector('tr > td:nth-child(2) > select')
                const comboBulanOptions = comboBulan.querySelectorAll('option')
                const comboBulanSelected = [...comboBulanOptions].find((option) => option.value === '' + month)
                comboBulanSelected.selected = true

                const inputTahun = element.querySelector('tr > td:nth-child(2) > input[name=thn]')
                inputTahun.value = '' + year

                const submit = element.querySelector('tr:nth-child(2) > td:nth-child(2) > input')
                submit.click()
            }, elements, m.date(), (m.month() + 1), m.year())
            await page.waitForNavigation()

            const xpathResult2 = '//div[@id="body"]'
            await page.waitForXPath(xpathResult2)
            const [elements2] = await page.$x(xpathResult2)
            const resultResponse = await page.evaluate((element) => {
                const array = element.innerText.split('\n').filter((f) => f !== '')
                const result = {
                    hari_lahir: array[1].split(':')[1].trim(),
                    deskripsi: array[2],
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

module.exports = { PekerjaanController }
