import { Response } from 'express';
import axios from 'axios';
import cheerio from 'cheerio';
import Controller from '@core/Controller';
import ResponseMessage from '@helpers/response-message';
import {
  KusonimeDownloadResponse,
  KusonimeDownloadListResponse,
  NekopoiDownloadResponse,
  NekopoiDownloadListResponse,
  NeonimeDownloadResponse,
  NeonimeDownloadListResponse,
  MangaDownloadResponse,
} from '@interfaces/anime.interface';

export default class ScrapeController extends Controller {
  async kusonime(): Promise<Response> {
    const { req } = this;
    const { search } = req.query;

    if (!search) {
      return this.errorResponse(
        ResponseMessage.queryRequired(['search'], ['dr stone']),
      );
    }

    const urlKusonime = `https://kusonime.com/?s=${search}&post_type=post`;

    // search page
    const responseSearch = await axios.get(urlKusonime);
    const selector = cheerio.load(responseSearch.data);
    const searchResult = selector('div[class="venz"] > ul');
    const firstSearchUrl = searchResult
      .contents()
      .first()
      .find('h2[class="episodeye"] > a')
      .attr('href');
    if (searchResult.contents().length === 0) {
      return this.errorResponse(ResponseMessage.notFound, 404);
    }

    // content page
    const responseContent = await axios.get(firstSearchUrl as string);
    const selectorContent = cheerio.load(responseContent.data);
    const rootContent = selectorContent('div[class="venser"]');
    const rootBody = rootContent.find('div[class="lexot"]');
    const rootInfo = rootBody.children('div[class="info"]');

    const thumbs = rootContent
      .find('div[class="post-thumb"] > img')
      .attr('src');
    const title = rootContent.find('div[class="post-thumb"] > h1').text();
    const titleJp = selectorContent(rootInfo.children('p').get(0))
      .text()
      .split(':')[1]
      .trim();
    const genre = selectorContent(rootInfo.children('p').get(1))
      .text()
      .split(':')[1]
      .trim();
    const season = selectorContent(rootInfo.children('p').get(2))
      .text()
      .split(':')[1]
      .trim();
    const producer = selectorContent(rootInfo.children('p').get(3))
      .text()
      .split(':')[1]
      .trim();
    const type = selectorContent(rootInfo.children('p').get(4))
      .text()
      .split(':')[1]
      .trim();
    const status = selectorContent(rootInfo.children('p').get(5))
      .text()
      .split(':')[1]
      .trim();
    const totalEpisode = selectorContent(rootInfo.children('p').get(6))
      .text()
      .split(':')[1]
      .trim();
    const score = selectorContent(rootInfo.children('p').get(7))
      .text()
      .split(':')[1]
      .trim();
    const duration = selectorContent(rootInfo.children('p').get(8))
      .text()
      .split(':')[1]
      .trim();
    const releasedOn = selectorContent(rootInfo.children('p').get(9))
      .text()
      .split(':')[1]
      .trim();
    const description = rootBody.children('p').first().text();
    const download = (() => {
      const temp: Array<KusonimeDownloadResponse> = [];
      const downloadBody = rootBody
        .children('div[class="dlbod"]')
        .children('div[class="smokeddl"]')
        .first();
      downloadBody.children('div[class="smokeurl"]').each((i, elm) => {
        const downloadList: Array<KusonimeDownloadListResponse> = [];
        const resolution = selectorContent(elm).children('strong').text();
        selectorContent(elm)
          .children('a')
          .each((iA, elmA) => {
            const downloadLink = selectorContent(elmA).attr('href');
            const downloader = selectorContent(elmA).text();
            downloadList.push({ download_link: downloadLink, downloader });
          });

        temp.push({ resolution, download_list: downloadList });
      });
      return temp;
    })();

    return this.successResponse({
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
    });
  }

  async neonime(): Promise<Response> {
    const { req } = this;
    const { search } = req.query;

    if (!search) {
      return this.errorResponse(
        ResponseMessage.queryRequired(['search'], ['one piece']),
      );
    }

    const url = `https://neonime.site/?s=${search}`;
    const responseSearch = await axios.get(url);
    const selectorSearch = cheerio.load(responseSearch.data);
    const firstSearchResultUrl = selectorSearch(
      'div[class="item_1 items"] > div',
    )
      .first()
      .find('a')
      .attr('href');
    const type = selectorSearch('div[class="item_1 items"] > div')
      .first()
      .find('span[class="calidad2 episode"]')
      .text();
    const noResult = selectorSearch('div[class="no_contenido_home"]');
    if (noResult.length === 1) {
      return this.errorResponse(ResponseMessage.notFound, 404);
    }

    const responseContent = await axios.get(firstSearchResultUrl as string);
    const selectorContent = cheerio.load(responseContent.data);
    if (type === 'Batch') {
      return this.errorResponse(ResponseMessage.notFound, 404);
    }

    const rootLoadA = selectorContent('div[class="ladoA"] > div[id="fixar"]');
    const rootLoadB = selectorContent(
      'div[class="ladoB"] > div[class="central"]',
    );
    const rootDownload = selectorContent(
      rootLoadB
        .find('div[id="links"] > div[class="linkstv"] > div > div')
        .get(1),
    );

    const thumb = rootLoadA
      .find('div[class="imagen"] > a > img')
      .attr('data-src');
    const date = rootLoadA.find('div[class="meta-a"] > p').text();
    const season = rootLoadA
      .find('div[class="meta-b"] > span[class="metx"]')
      .first()
      .children('i')
      .text();
    const episode = rootLoadB
      .find('div[id="info"] > div[class="metadatac"]')
      .first()
      .children('span')
      .text();
    const genre = rootLoadB
      .find('div[id="info"] > div[class="metadatac"]')
      .filter((i, elm) => selectorContent(elm).find('b').text() === 'Genre')
      .children('span')
      .text();
    const source = rootLoadB
      .find('div[id="info"] > div[class="metadatac"]')
      .filter((i, elm) => selectorContent(elm).find('b').text() === 'Source')
      .children('span')
      .text();
    const title = rootLoadB
      .find('div[id="info"] > div[class="contenidotv"] > h2')
      .text();
    const descriptions: Array<string> = [];
    rootLoadB
      .find(
        'div[id="info"] > div[class="contenidotv"] > div[itemprop="description"] > p',
      )
      .each((i, elm) => {
        if (i > 0) descriptions.push(selectorContent(elm).text());
      });
    const description = descriptions.join('\n');

    // get download
    let indexMp4 = 0;
    let mp4Exist = false;
    let indexMkv = 0;
    let mkvExist = false;
    let sumIndex = 0;
    rootDownload
      .find('ul')
      .contents()
      .each((i, elm) => {
        if (selectorContent(elm).text() === 'MP4') {
          indexMp4 = i;
          mp4Exist = true;
        }
        if (selectorContent(elm).text() === 'MKV') {
          indexMkv = i;
          mkvExist = true;
        }
        if ((elm as any).tagName === 'ul') sumIndex += 1;
      });
    // cek jika mp4 ada
    if (mp4Exist && !mkvExist) {
      sumIndex += 1;
      indexMkv = sumIndex;
      sumIndex = 0;
    }
    // cek jika mkv ada
    if (!mp4Exist && mkvExist) {
      sumIndex += 1;
      indexMkv = 0;
    }
    // jika mp4 dan mkv ada
    if (mp4Exist && mkvExist) {
      sumIndex += 2; // karena termasuk mp4 dan mkv
    }

    const downloadMp4: Array<NeonimeDownloadResponse> = [];
    rootDownload
      .find('ul')
      .contents()
      .slice(indexMp4 + 1, indexMkv)
      .each((i1, elm1) => {
        const resolution = selectorContent(elm1)
          .find('li > label')
          .text()
          .trim();

        const server: Array<NeonimeDownloadListResponse> = [];
        selectorContent(elm1)
          .find('li > a')
          .each((i2, elm2) => {
            const name = selectorContent(elm2).text();
            const link = selectorContent(elm2).attr('href');
            server.push({ name, link });
          });
        downloadMp4.push({ resolution, server });
      });

    const downloadMkv: Array<NeonimeDownloadResponse> = [];
    rootDownload
      .find('ul')
      .contents()
      .slice(indexMkv + 1, sumIndex)
      .each((i1, elm1) => {
        const resolution = selectorContent(elm1)
          .find('li > label')
          .text()
          .trim();

        const server: Array<NeonimeDownloadListResponse> = [];
        selectorContent(elm1)
          .find('li > a')
          .each((i2, elm2) => {
            const name = selectorContent(elm2).text();
            const link = selectorContent(elm2).attr('href');
            server.push({ name, link });
          });
        downloadMkv.push({ resolution, server });
      });

    return this.successResponse({
      thumb,
      title,
      date,
      season,
      episode,
      genre,
      source,
      description,
      download_mp4: downloadMp4,
      download_mkv: downloadMkv,
    });
  }

  async nekopoi(): Promise<Response> {
    const page = 1 + Math.floor(Math.random() * 258);
    const url = `https://nekopoi.care/page/${page}`;

    // search page
    const responseSearch = await axios.get(url);
    const selectorSearch = cheerio.load(responseSearch.data);
    const searchResult = selectorSearch('#boxid').children('.eropost');
    const randomPost = 1 + Math.floor(Math.random() * searchResult.length);
    const post = selectorSearch(
      selectorSearch('#boxid').children('.eropost').get(randomPost),
    );
    const postUrl = post.find('.eroinfo > h2 > a').attr('href');

    // content page
    const responseContent = await axios.get(postUrl as string);
    const selectorContent = cheerio.load(responseContent.data);
    const rootHeader = selectorContent('.eropost > .eroinfo');
    const rootContent = selectorContent('.contentpost');
    const rootDownload = selectorContent('.arealinker > .boxdownload');

    const thumb = rootContent.find('.thm > img').attr('src');
    // info
    const getText = (infoType: string) => {
      const info = rootContent.find('.konten > p').filter((i, elm) => {
        const type = selectorContent(elm).text().split(':')[0].trim();
        if (type === infoType) return true;
        return false;
      });
      const textArray = info.text().split(':');
      return textArray.slice(1, textArray.length).join('').trim();
    };
    const title = rootHeader.children('h1').text();
    const titleJp = getText('Japanese Title');
    const movieId = getText('Movie ID');
    const producers = getText('Producers');
    const costume = getText('Costume');
    const artist = getText('Artist');
    const genre = getText('Genre');
    const duration = getText('Duration');
    const size = getText('Size')
      .split('|')
      .map((val) => val.trim())
      .join(' | ');

    // download
    const downloads: Array<NekopoiDownloadResponse> = [];
    rootDownload.find('.liner').each((i, elm) => {
      const title = selectorContent(elm).children('.name').text();
      const downloadLink: Array<NekopoiDownloadListResponse> = [];
      selectorContent(elm)
        .find('.listlink > p > a')
        .each((iA, elmA) => {
          const server = selectorContent(elmA).text();
          const link = selectorContent(elmA).attr('href');
          downloadLink.push({ server, link });
        });
      downloads.push({ title, download_link: downloadLink });
    });

    return this.successResponse({
      thumb,
      url: postUrl,
      title,
      title_jp: titleJp,
      movie_id: movieId,
      producers,
      costume,
      artist,
      genre,
      duration,
      size,
      downloads,
    });
  }

  async manga(): Promise<Response> {
    const { req } = this;
    const { search } = req.query;

    if (!search) {
      return this.errorResponse(
        ResponseMessage.queryRequired(['search'], ['dr stone']),
      );
    }

    const url = `https://www.meganebuk.net/?s=${search}`;

    // search page
    const responseSearch = await axios.get(url);
    const selectorSearch = cheerio.load(responseSearch.data);
    const searchResult = selectorSearch('#main > article');
    const firstResultUrl = searchResult.first().children('a').attr('href');
    if (searchResult.length === 0) {
      return this.errorResponse(ResponseMessage.notFound, 404);
    }

    // content page
    const responseContent = await axios.get(firstResultUrl as string);
    const selectorContent = cheerio.load(responseContent.data);
    const root = selectorContent('#content > #primary > #main');
    const rootDetail = selectorContent(
      root.find('div.entry-content > table').get(0),
    ).find('tbody > tr');
    const rootDownload = selectorContent(
      root.find('div.entry-content > table').get(1),
    ).find('tbody > tr');
    const rootDownload2 = root.find('div.aligncenter');

    const note = root.children('div').first().text();
    const thumb = (() => root.find('img.lazyload').attr('data-src'))();
    const title = root.find('td.tr-caption').text();
    const description = root
      .find('div.entry-content > div[style="text-align: justify;"]')
      .map((i, elm) => selectorContent(elm).text())
      .get();

    // info
    const getInfo = (info: string) =>
      rootDetail
        .filter((i, elm) => selectorContent(elm).find('td > b').text() === info)
        .children('td')
        .last()
        .text();

    const name = getInfo('Name');
    const type = getInfo('Type');
    const author = getInfo('Author');
    const genre = getInfo('Genre');
    const rating = getInfo('Rating');
    const released = getInfo('Released');
    const status = getInfo('Status');

    const downloads = (() => {
      let index = 0;
      let lastIndex = 0;
      const temp: Array<MangaDownloadResponse> = [];

      index = rootDownload.children('td[bgcolor]').parent().index();
      lastIndex = rootDownload.last().index();

      // jika ada table
      if (rootDownload.length !== 0) {
        // artinya ada tempat download terpisah, seperti one piece
        if (index === -1) index += 1;

        rootDownload
          .slice(index + 1, lastIndex + 1)
          // filter jika ada note di tengah" tempat download
          .filter(
            (i, elm) =>
              selectorContent(elm).children('td:not(colspan)').length !== 1,
          )
          .each((i, elm) => {
            const td = selectorContent(elm).children('td');
            const date = td.children(':not(a)').text();
            const title = td.children('a').first().text();
            const link = td.children('a').first().attr('href');
            temp.push({ date, title, link });
          });
      } else {
        rootDownload2.each((i, elm) => {
          const date = selectorContent(elm).children(':not(a)').text();
          const title = selectorContent(elm).children('a').first().text();
          const link = selectorContent(elm).children('a').first().attr('href');
          temp.push({ date, title, link });
        });
      }

      return temp;
    })();

    return this.successResponse({
      note,
      thumb,
      title,
      description,
      name,
      type,
      author,
      genre,
      rating,
      released,
      status,
      downloads,
    });
  }
}
