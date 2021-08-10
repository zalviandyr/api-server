import akaneko from 'akaneko';
import axios from 'axios';
import fsPromise from 'fs/promises';
import { Response } from 'express';
import Controller from '@core/Controller';
import { ListGenreAnimePic, FilePath } from '@helpers/enums';
import ResponseMessage from '@helpers/response-message';

export default class AnimeController extends Controller {
  private async getType(filePathPic: string): Promise<string> {
    const data = await fsPromise.readFile(filePathPic, 'utf8');
    const json = JSON.parse(data);
    const random = Math.floor(Math.random() * json.length);
    return json[random];
  }

  async animePic(): Promise<Response> {
    return this.successResponse(
      Object.values(ListGenreAnimePic),
      'List genre anime pic',
    );
  }

  async animePicGenre(): Promise<Response> {
    const { req } = this;
    const { genre } = req.params;

    if (Object.values<string>(ListGenreAnimePic).includes(genre as string)) {
      let type;

      // SFW
      if (genre === ListGenreAnimePic.Neko) type = akaneko.neko();
      if (genre === ListGenreAnimePic.SFWFoxes) type = akaneko.sfwfoxes();
      if (genre === ListGenreAnimePic.Husbu)
        type = this.getType(FilePath.HusbuPic);
      if (genre === ListGenreAnimePic.Inori)
        type = this.getType(FilePath.InoriPic);
      if (genre === ListGenreAnimePic.LoliSFW)
        type = this.getType(FilePath.LoliSFWPic);
      if (genre === ListGenreAnimePic.RandomSFW)
        type = this.getType(FilePath.WaifuPic);
      if (genre === ListGenreAnimePic.Shota)
        type = this.getType(FilePath.ShotaPic);
      if (genre === ListGenreAnimePic.WallpaperSFW)
        type = this.getType(FilePath.AnimeWallpaper);

      // NSFW
      if (genre === ListGenreAnimePic.Ass) type = akaneko.nsfw.ass();
      if (genre === ListGenreAnimePic.BDSM) type = akaneko.nsfw.bdsm();
      if (genre === ListGenreAnimePic.Blowjob) type = akaneko.nsfw.blowjob();
      if (genre === ListGenreAnimePic.Cum) type = akaneko.nsfw.cum();
      if (genre === ListGenreAnimePic.Doujin) type = akaneko.nsfw.doujin();
      if (genre === ListGenreAnimePic.Feet) type = akaneko.nsfw.feet();
      if (genre === ListGenreAnimePic.Femdom) type = akaneko.nsfw.femdom();
      if (genre === ListGenreAnimePic.FoxGirl) type = akaneko.nsfw.foxgirl();
      if (genre === ListGenreAnimePic.Glasses) type = akaneko.nsfw.glasses();
      if (genre === ListGenreAnimePic.Hentai) type = akaneko.nsfw.hentai();
      if (genre === ListGenreAnimePic.Loli)
        type = this.getType(FilePath.LoliNSFWPic);
      if (genre === ListGenreAnimePic.Netorare) type = akaneko.nsfw.netorare();
      if (genre === ListGenreAnimePic.Maid) type = akaneko.nsfw.maid();
      if (genre === ListGenreAnimePic.Masturbation)
        type = akaneko.nsfw.masturbation();
      if (genre === ListGenreAnimePic.Orgy) type = akaneko.nsfw.orgy();
      if (genre === ListGenreAnimePic.Panties) type = akaneko.nsfw.panties();
      if (genre === ListGenreAnimePic.Pussy) type = akaneko.nsfw.pussy();
      if (genre === ListGenreAnimePic.School) type = akaneko.nsfw.school();
      if (genre === ListGenreAnimePic.Succubus) type = akaneko.nsfw.succubus();
      if (genre === ListGenreAnimePic.Tentacles)
        type = akaneko.nsfw.tentacles();
      if (genre === ListGenreAnimePic.Thighs) type = akaneko.nsfw.thighs();
      if (genre === ListGenreAnimePic.UglyBastard)
        type = akaneko.nsfw.uglyBastard();
      if (genre === ListGenreAnimePic.Uniform) type = akaneko.nsfw.uniform();
      if (genre === ListGenreAnimePic.Yuri) type = akaneko.nsfw.yuri();
      if (genre === ListGenreAnimePic.Yaoi)
        type = this.getType(FilePath.YaoiPic);
      if (genre === ListGenreAnimePic.WallpaperNSFW)
        type = akaneko.nsfw.mobileWallpapers();

      const result = await type;
      return this.successResponse(result);
    }

    return this.errorResponse('Genre not found', 404);
  }

  async whatAnime(): Promise<Response> {
    const { req } = this;
    const { limit, url } = req.query;

    if (!url) {
      return this.errorResponse(ResponseMessage.queryRequired(['url']));
    }

    const { data } = await axios.get(`https://api.trace.moe/search?url=${url}`);
    const resultArray = [];
    const loopLimit = limit || data.result.length;
    for (let i = 0; i < loopLimit; i++) {
      const malId = data.result[i].anilist;
      const similarity = Math.floor(data.result[i].similarity * 10);

      try {
        const jikanResponse = await axios.get(
          `https://api.jikan.moe/v3/anime/${malId}`,
        );
        const myAnimeList = jikanResponse.data.url;
        const thumb = jikanResponse.data.image_url;
        const { title } = jikanResponse.data;
        const titleJp = jikanResponse.data.title_japanese;
        const { score } = jikanResponse.data;
        const season = jikanResponse.data.premiered;
        const genre = jikanResponse.data.genres
          .map((map: any) => map.name)
          .join(', ');

        const result = {
          url: myAnimeList,
          thumb,
          title,
          title_jp: titleJp,
          score,
          genre,
          season,
          similarity,
        };
        resultArray.push(result);
      } catch (err) {
        // catch if 404 in jikanime
      }
    }

    return this.successResponse(resultArray);
  }
}
