import { Response } from 'express';
import axios from 'axios';
import cheerio from 'cheerio';
import Controller from '@core/Controller';
import ResponseMessage from '@helpers/response-message';
import { shortTitleDrakorasia } from '@helpers/values';
import {
  DrakorasiaDownloadListResponse,
  DrakorasiaDownloadResponse,
  DrakorasiaEpisodeListResponse,
} from '@interfaces/film.interface';

export default class DrakorController extends Controller {
  async drakorasia(): Promise<Response> {
    const { req } = this;
    const { search } = req.query;
    if (!search) {
      return this.errorResponse(
        ResponseMessage.queryRequired(['search'], ['tale']),
      );
    }

    const url = `https://drakorasia.cc/?s=${search}&post_type=post`;

    // search page
    const responseSearch = await axios.get(url);
    const selectorSearch = cheerio.load(responseSearch.data);
    const searchResult = selectorSearch('#latest > .grid');
    const firstSearchUrl = searchResult
      .find('#post > .cover > .thumbnail > a')
      .attr('href');
    if (firstSearchUrl === undefined) {
      return this.errorResponse(ResponseMessage.notFound);
    }

    // content page
    const responseContent = await axios.get(firstSearchUrl);
    const selectorContent = cheerio.load(responseContent.data);
    // const rootHeader = selectorContent('div[class="if-ct"] > div[class="inf"] > div[class="container"]')
    const rootHeader = selectorContent('#info_drama');
    const rootDownload = selectorContent('#content-post > table');

    const thumb = rootHeader.find('.thumbnail > img').attr('src');
    const title = rootHeader.find('.detail > h2').text();
    const titleKr = rootHeader
      .find('.detail > p')
      .first()
      .text()
      .split('/')[0]
      .trim();
    const year = rootHeader
      .find('.detail > p')
      .first()
      .text()
      .split('/')[1]
      .trim();
    const episode = rootHeader
      .find('.detail > p')
      .first()
      .text()
      .split('/')[2]
      .trim();
    const genre = rootHeader
      .find('.detail > .gens')
      .text()
      .trim()
      .replace(/ /g, ', ');
    const duration = rootHeader.find('.detail > .durs > span').text().trim();
    const network = rootHeader.find('.detail > .durs > a').text().trim();
    const synopsis = selectorContent('#synopsis > p').text().trim();

    // casters
    const tempCasters: Array<string> = [];
    rootHeader.find('.detail > .casts > p > a').each((i, elm) => {
      tempCasters.push(selectorContent(elm).text());
    });
    const casters = tempCasters.join(', ');

    // episodes
    const episodes: Array<DrakorasiaEpisodeListResponse> = [];
    const availableResolution: Array<string> = [];
    rootDownload.find('thead > tr > th').each((i, elm) => {
      if (i > 0)
        availableResolution.push(selectorContent(elm).text().split(' ')[1]);
    });

    rootDownload.find('tbody > tr').each((i, elm) => {
      const downloads: Array<DrakorasiaDownloadResponse> = [];
      const episode = selectorContent(elm).children('td').first().text();

      // tidak mengambil episode, hanya download link
      for (let j = 1; j <= availableResolution.length; j++) {
        const downloadLink: Array<DrakorasiaDownloadListResponse> = [];
        const resolution = availableResolution[j - 1];

        // link download
        selectorContent(selectorContent(elm).children('td').get(j))
          .children('a')
          .each((iA, elmA) => {
            let title = selectorContent(elmA).text();
            const link = selectorContent(elmA).attr('href');

            shortTitleDrakorasia.forEach((val) => {
              if (val.shortName === title) title = val.name;
            });
            downloadLink.push({ title, link });
          });
        // const server = selectorContent(elm).children('td').children('a').text()
        downloads.push({ resolution, download_link: downloadLink });
      }
      episodes.push({ episode, downloads });
    });

    return this.successResponse({
      thumb,
      title,
      title_kr: titleKr,
      year,
      episode,
      genre,
      duration,
      network,
      synopsis,
      casters,
      episodes,
    });
  }
}
