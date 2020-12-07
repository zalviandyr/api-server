const puppeteer = require('puppeteer')
const { puppeteerValues } = require('helpers/values')
const { CustomMessage } = require('helpers/CustomMessage')

class PasanganController {
    constructor(req, res) {
        this.request = req
        this.response = res
    }

    async controller() {
        const { request, response } = this
        let { nama1, nama2 } = request.query
        if (!nama1 && !nama2) {
            return new CustomMessage(response).error({
                status_code: 400,
                message: 'Silahkan isi query nama1 dan nama2, Contoh: ?nama1=ucup&nama2=otong',
            }, 400)
        }

        nama1 = nama1.replace('/ /g', '+')
        nama2 = nama2.replace('/ /g', '+')
        const url = `https://www.primbon.com/kecocokan_nama_pasangan.php?nama1=${nama1}&nama2=${nama2}&proses=+Submit!+`;

        const browser = await puppeteer.launch(puppeteerValues.options)
        try {
            const page = await browser.newPage()
            // user agent
            await page.setUserAgent(puppeteerValues.userAgent)

            await page.goto(url, { waitUntil: 'networkidle0' })
            const xpathResult = '//div[@id="body"]'
            await page.waitForXPath(xpathResult)
            const [elements] = await page.$x(xpathResult)
            const resultResponse = await page.evaluate((element) => {
                const removeEmpty = element.innerText.split('\n').filter((e) => e !== '')
                const removeUnnecessary = removeEmpty.splice(1).splice(0, 5)
                const namaAnda = removeUnnecessary[0].split(':')[1].trim()
                const namaPasangan = removeUnnecessary[1].split(':')[1].trim()
                const sisiPositifAnda = removeUnnecessary[2].split(':')[1].trim()
                const sisiNegatifAnda = removeUnnecessary[3].split(':')[1].trim()
                const deskripsi = removeUnnecessary[4]

                const result = {
                    nama_anda: namaAnda,
                    nama_pasangan: namaPasangan,
                    sisi_positif_anda: sisiPositifAnda,
                    sisi_negatif_anda: sisiNegatifAnda,
                    deskripsi,
                }
                return result
            }, elements)

            return new CustomMessage(response).success(resultResponse, 200, async () => { await browser.close() })
        } catch (err) {
            return new CustomMessage(response).error({
                status_code: 500,
                message: err.message,
            }, 500, async () => { await browser.close() })
        }
    }
}

module.exports = { PasanganController }
