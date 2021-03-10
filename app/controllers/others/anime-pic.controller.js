const akaneko = require('akaneko')
const axios = require('axios')
const fs = require('fs').promises
const trev = require('trev')
const Loli = require('lolis.life');
const { CustomMessage } = require('helpers/CustomMessage')
const { filePath } = require('helpers/values')

class AnimePicController {
    constructor(req, res) {
        this.request = req
        this.response = res
    }

    async controller() {
        const { request, response } = this
        const { genre } = request.query

        if (!genre) {
            return new CustomMessage(response).error({
                status_code: 400,
                message: 'Silahkan input query genre, contoh ?genre=random',
            }, 400)
        }

        const genreList = [
            'neko', 'foxgirl', 'husbu', 'lolisfw', 'randomsfw',
            'inori', 'wallpapersfw',

            'ass', 'bdsm', 'blowjob', 'cum',
            'doujin', 'feet', 'femdom', 'glasses', 'hentai', 'loli',
            'netorare', 'maid', 'masturbation', 'orgy', 'panties',
            'pussy', 'school', 'tentacles', 'thighs', 'uglybastard',
            'uniform', 'yuri', 'yaoi', 'wallpapernsfw', 'randomnsfw']

        try {
            const getType = async (filePathPic) => {
                const data = await fs.readFile(filePathPic, 'utf8')
                const json = JSON.parse(data)
                const random = Math.floor(Math.random() * json.length)
                return json[random]
            }

            if (genreList.includes(genre)) {
                let type

                // SFW
                if (genre === 'neko') type = akaneko.neko()
                if (genre === 'foxgirl') type = akaneko.foxgirl()
                if (genre === 'randomsfw') type = getType(filePath.waifuPic)
                if (genre === 'lolisfw') {
                    type = (async () => {
                        const loli = new Loli();
                        const { url } = await loli.getSFWLoli()
                        return url
                    })()
                }
                if (genre === 'husbu') type = getType(filePath.husbuPic)
                if (genre === 'inori') type = getType(filePath.inoriPic)
                if (genre === 'wallpapersfw') type = getType(filePath.animeWallpaper)

                // NSFW
                if (genre === 'ass') type = akaneko.nsfw.ass()
                if (genre === 'bdsm') type = akaneko.nsfw.bdsm()
                if (genre === 'blowjob') type = akaneko.nsfw.blowjob()
                if (genre === 'cum') type = akaneko.nsfw.cum()
                if (genre === 'doujin') type = akaneko.nsfw.doujin()
                if (genre === 'feet') type = akaneko.nsfw.feet()
                if (genre === 'femdom') type = akaneko.nsfw.femdom()
                if (genre === 'glasses') type = akaneko.nsfw.glasses()
                if (genre === 'hentai') type = akaneko.nsfw.hentai()
                if (genre === 'netorare') type = akaneko.nsfw.netorare()
                if (genre === 'maid') type = akaneko.nsfw.maid()
                if (genre === 'masturbation') type = akaneko.nsfw.masturbation()
                if (genre === 'orgy') type = akaneko.nsfw.orgy()
                if (genre === 'panties') type = akaneko.nsfw.panties()
                if (genre === 'pussy') type = akaneko.nsfw.pussy()
                if (genre === 'school') type = akaneko.nsfw.school()
                if (genre === 'tentacles') type = akaneko.nsfw.tentacles()
                if (genre === 'thighs') type = akaneko.nsfw.thighs()
                if (genre === 'uglybastard') type = akaneko.nsfw.uglyBastard()
                if (genre === 'uniform') type = akaneko.nsfw.uniform()
                if (genre === 'yuri') type = akaneko.nsfw.yuri()
                if (genre === 'yaoi') type = getType(filePath.yaoiPic)
                if (genre === 'wallpapernsfw') type = akaneko.nsfw.mobileWallpapers()
                if (genre === 'randomnsfw') type = trev.nsfw.hentai()
                if (genre === 'loli') {
                    type = (async () => {
                        const loli = new Loli();
                        const { url } = await loli.getNSFWLoli()
                        return url
                    })()
                }

                let result
                const url = await type
                if (genre === 'randomnsfw') result = { url: url.media }
                else result = { url }

                return new CustomMessage(response).success(result)
            }

            return new CustomMessage(response).error({
                status_code: 404,
                message: 'Genre not found',
            }, 404)
        } catch (err) {
            return new CustomMessage(response).error({
                status_code: 500,
                message: err.message,
            }, 500)
        }
    }
}

module.exports = { AnimePicController }
