const puppeteer = require('puppeteer')
const { puppeteerValues } = require('helpers/values')
const { CustomMessage } = require('helpers/CustomMessage')

class ArtiNamaController {
    constructor(req, res) {
        this.request = req
        this.response = res
    }

    async controller() {
        const { request, response } = this
        let { nama } = request.query
        if (!nama) {
            return new CustomMessage(response).error({
                status_code: 400,
                message: 'Silahkan isi query nama',
            }, 400)
        }

        nama = nama.replace(/ /g, '+')
        const url = `https://www.primbon.com/arti_nama.php?nama1=${nama}&proses=+Submit%21+`;

        const browser = await puppeteer.launch(puppeteerValues.options)
        try {
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

            const resultResponse = {
                arti: dataSplit[0].trim(),
                deskripsi: dataSplit[1].trim(),
            }

            return new CustomMessage(response).success(resultResponse, 200, async () => { await browser.close() })
        } catch (err) {
            return new CustomMessage(response).error({
                status_code: 500,
                message: err.message,
            }, 500, async () => { await browser.close() })
        }
    }
}

module.exports = { ArtiNamaController }
