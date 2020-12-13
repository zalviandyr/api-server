const urlBmkg = {
    aceh: 'https://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-Aceh.xml',
    bali: 'https://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-Bali.xml',
    bangkaBelitung: 'https://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-BangkaBelitung.xml',
    banten: 'https://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-Banten.xml',
    bengkulu: 'https://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-Bengkulu.xml',
    diYogyakarta: 'https://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-DIYogyakarta.xml',
    dkiJakarta: 'https://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-DKIJakarta.xml',
    gorontalo: 'https://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-Gorontalo.xml',
    jambi: 'https://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-Jambi.xml',
    jawaBarat: 'https://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-JawaBarat.xml',
    jawaTengah: 'https://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-JawaTengah.xml',
    jawaTimur: 'https://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-JawaTimur.xml',
    kalimantanBarat: 'https://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-KalimantanBarat.xml',
    kalimantanSelatan: 'https://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-KalimantanSelatan.xml',
    kalimantanTengah: 'https://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-KalimantanTengah.xml',
    kalimantanTimur: 'https://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-KalimantanTimur.xml',
    kalimantanUtara: 'https://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-KalimantanUtara.xml',
    kepulauanRiau: 'https://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-KepulauanRiau.xml',
    lampung: 'https://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-Lampung.xml',
    maluku: 'https://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-Maluku.xml',
    malukuUtara: 'https://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-MalukuUtara.xml',
    nusaTenggaraBarat: 'https://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-NusaTenggaraBarat.xml',
    nusaTenggaraTimur: 'https://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-NusaTenggaraTimur.xml',
    papua: 'https://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-Papua.xml',
    papuaBarat: 'https://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-PapuaBarat.xml',
    riau: 'https://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-Riau.xml',
    sulawesiBarat: 'https://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-SulawesiBarat.xml',
    sulawesiSelatan: 'https://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-SulawesiSelatan.xml',
    sulawesiTengah: 'https://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-SulawesiTengah.xml',
    sulawesiTenggara: 'https://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-SulawesiTenggara.xml',
    sulawesiUtara: 'https://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-SulawesiUtara.xml',
    sumateraBarat: 'https://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-SumateraBarat.xml',
    sumateraSelatan: 'https://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-SumateraSelatan.xml',
    sumateraUtara: 'https://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-SumateraUtara.xml',
}
exports.urlBmkg = urlBmkg

const authentication = {
    igBlade: {
        bearer: ***REMOVED***,
    },
    ibm: {
        username: ***REMOVED***,
        password: ***REMOVED***,
    },
    saweria: {
        email: ***REMOVED***,
        password: ***REMOVED***,
    },
}
exports.authentication = authentication

const filePath = {
    kabupatenKota: './storages/kabupaten-kota.json',
    quotes: './storages/quotes.json',
    quotesAgamis: './storages/quotes-agamis.json',
    waifuPic: './storages/waifu-pic.json',
    husbuPic: './storages/husbu-pic.json',
    yaoiPic: './storages/yaoi-pic.json',
}
exports.filePath = filePath

const puppeteerValues = {
    options: { args: ["--proxy-server='direct://'", '--proxy-bypass-list=*', '--no-sandbox', '--disable-setuid-sandbox'], headless: true },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36',
}
exports.puppeteerValues = puppeteerValues

const shortTitleDrakorasia = [
    {
        shortName: 'GD',
        name: 'Googledrive',
    }, {
        shortName: 'UB',
        name: 'Uptobox',
    }, {
        shortName: 'MA',
        name: 'Mediafire',
    }, {
        shortName: 'FI',
        name: 'FilesIm',
    }, {
        shortName: 'MG',
        name: 'Mega',
    }, {
        shortName: 'AF',
        name: 'Acefile',
    }, {
        shortName: 'SP',
        name: 'SharerPW',
    }, {
        shortName: 'UC',
        name: 'Uptocloud',
    }, {
        shortName: 'ZS',
        name: 'Zippyshare',
    }, {
        shortName: 'MR',
        name: 'Mirrorace',
    }, {
        shortName: 'MF',
        name: 'FilesCx',
    }, {
        shortName: 'RC',
        name: 'Racaty',
    },
]
exports.shortTitleDrakorasia = shortTitleDrakorasia
