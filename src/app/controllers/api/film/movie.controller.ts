import { Response } from 'express';
import puppeteer from 'puppeteer';
import axios from 'axios';
import cheerio from 'cheerio';
import https from 'https';
import Controller from '@core/Controller';
import ResponseMessage from '@helpers/response-message';
import { puppeteerValues } from '@helpers/values';
import {
  Movie2DownloadListResponse,
  Movie2DownloadResponse,
} from '@interfaces/film.interface';

export default class MovieController extends Controller {
  async movie(): Promise<Response> {
    const { req } = this;
    const { search } = req.query;
    if (!search) {
      return this.errorResponse(
        ResponseMessage.queryRequired(['search'], ['spiderman']),
      );
    }

    const url = `http://185.63.253.222/?s=${search}`;
    const browser = await puppeteer.launch(puppeteerValues.options);
    const downloadPage = await browser.newPage();

    try {
      // set user agent
      await downloadPage.setUserAgent(puppeteerValues.userAgent);

      // search page
      const responseSearch = await axios.get(url);
      const selectorSearch = cheerio.load(responseSearch.data);
      const searchResult = selectorSearch('div.grid.row > div');
      const firstSearchUrl = searchResult
        .first()
        .find('div.thumbnail > a')
        .attr('href');
      if (searchResult.length === 0) {
        return this.errorResponse(ResponseMessage.notFound, 404);
      }

      // content page
      const responseContent = await axios.get(firstSearchUrl as string);
      const selectorContent = cheerio.load(responseContent.data);
      const root = selectorContent('div.entry-content');
      const downloadUrl = selectorContent('div.download-movie > a')
        .first()
        .attr('href');

      const thumb = root.find('div.col-md-3 > img').attr('src');
      const title = root.find('div.col-md-3 > img').attr('title');
      const genre = root
        .find('div.col-md-12 > table > tbody > tr')
        .filter(
          (i, elm) => selectorContent(elm).children('th').text() === 'Genre',
        )
        .children('td')
        .text();
      const actor = root
        .find('div.col-md-12 > table > tbody > tr')
        .filter(
          (i, elm) => selectorContent(elm).children('th').text() === 'Actor',
        )
        .children('td')
        .text();
      const director = root
        .find('div.col-md-12 > table > tbody > tr')
        .filter(
          (i, elm) => selectorContent(elm).children('th').text() === 'Director',
        )
        .children('td')
        .text();
      const country = root
        .find('div.col-md-12 > table > tbody > tr')
        .filter(
          (i, elm) => selectorContent(elm).children('th').text() === 'Country',
        )
        .children('td')
        .text();
      const quality = root
        .find('div.col-md-12 > table > tbody > tr')
        .filter(
          (i, elm) => selectorContent(elm).children('th').text() === 'Quality',
        )
        .children('td')
        .text();
      const imdb = root
        .find('div.col-md-12 > table > tbody > tr')
        .filter(
          (i, elm) => selectorContent(elm).children('th').text() === 'IMDb',
        )
        .children('td')
        .text();
      const release = root
        .find('div.col-md-12 > table > tbody > tr')
        .filter(
          (i, elm) => selectorContent(elm).children('th').text() === 'Release',
        )
        .children('td')
        .text();
      const duration = root
        .find('div.col-md-12 > table > tbody > tr')
        .filter(
          (i, elm) => selectorContent(elm).children('th').text() === 'Duration',
        )
        .children('td')
        .text();
      const synopsis = root.find('div#movie-synopsis > div > p').text();

      // download page
      await downloadPage.goto(downloadUrl as string, {
        waitUntil: 'domcontentloaded',
      });

      const xpathDownloadTable = '//div[@class="table-responsive"]';
      await downloadPage.waitForXPath(xpathDownloadTable);
      const [elementsDownloadTable] = await downloadPage.$x(xpathDownloadTable);
      const downloads = await downloadPage.evaluate((element) => {
        // pasti ada link yang awalnya '//', kagak tau kenapa dibuat begitu
        const cleanUrl = (link: string) => {
          if (link.startsWith('//')) {
            return link.replace('//', 'http://');
          }
          return link;
        };

        const listDownloadAvailable = (() => {
          const temp = [];
          const listTh = element.querySelectorAll(
            'table > thead > tr:nth-child(2) > th',
          );
          for (let i = 0; i < listTh.length; i++) {
            temp.push(listTh[i].innerText);
          }
          return temp;
        })();

        const temp = [];
        const listTr = element.querySelectorAll('table > tbody > tr');
        for (let i = 0; i < listTr.length; i++) {
          const downloadLink = [];
          const provider = listTr[i].querySelector('td:nth-child(1)').innerText;
          const resolution =
            listTr[i].querySelector('td:nth-child(2)').innerText;

          const iterationDownloadAvailable = 2 + listDownloadAvailable.length;
          for (let j = 3; j <= iterationDownloadAvailable; j++) {
            const title = listDownloadAvailable[j - 3];
            let link = listTr[i].querySelector(`td:nth-child(${j}) > a`);
            if (link) {
              link = cleanUrl(link.getAttribute('href'));
            }

            downloadLink.push({ title, link });
          }
          temp.push({ provider, resolution, download_link: downloadLink });
        }

        return temp;
      }, elementsDownloadTable);

      return this.successResponse(
        {
          thumb,
          title,
          genre,
          actor,
          director,
          country,
          quality,
          imdb,
          release,
          duration,
          synopsis,
          downloads,
        },
        'Success get data',
        200,
        () => browser.close(),
      );
    } catch (err) {
      return this.errorResponse(err.message, 400, () => browser.close());
    }
  }

  async movie2(): Promise<Response> {
    const { req } = this;
    const { search } = req.query;
    if (!search) {
      return this.errorResponse(ResponseMessage.queryRequired(['search']));
    }

    const url = `https://167.86.71.48/?s=${search}`;
    // search page
    const agent = new https.Agent({ rejectUnauthorized: false });
    const responseSearch = await axios.get(url, {
      httpsAgent: agent,
    });
    const selectorSearch = cheerio.load(responseSearch.data);
    const searchResult = selectorSearch(
      selectorSearch('div#movies > div').get(1),
    ).children('div');
    const firstSearchUrl = searchResult.first().children('a').attr('href');
    if (searchResult.length === 0) {
      return this.errorResponse(ResponseMessage.notFound, 404);
    }

    // content page
    const responseContent = await axios.get(firstSearchUrl as string, {
      httpsAgent: agent,
    });
    const selectorContent = cheerio.load(responseContent.data);
    const root = selectorContent('div#main-content');
    const rootHeader = root.children('div.tpost');
    const rootDetail = root
      .children('div.info_movie')
      .children('div.postdetail');
    const rootDownload = root.find('#dl_tab > div');

    const thumb = rootHeader.find('div > img').attr('src');
    const score = rootHeader
      .find('div > div > span.bg-yellow-105')
      .first()
      .text();
    const quality = rootHeader
      .find('div > div > span.bg-blue-500')
      .last()
      .text();
    const title = rootDetail.children('h1').text();

    // year, country and duration
    let temp;
    temp = rootDetail.children('div.thn').children('div.mr-4');
    const year = temp.first().text();
    const country = temp.next().first().text();
    const duration = temp.last().text();

    temp = rootDetail.children('div.info').children('p');
    const director = temp.first().text().split(':')[1].trim();
    const rating = temp.next().first().text().split(':')[1].trim();
    const genre = temp
      .last()
      .children('a')
      .map((i, elm) => selectorContent(elm).text())
      .get()
      .join(', ');
    const synopsis = root.find('div#tab-1 > p').text();
    const trailer = root
      .find('div#tab-2 > div.player-embed > iframe')
      .attr('src');

    // downloads
    const downloads: Array<Movie2DownloadResponse> = [];
    rootDownload.each((i, elm) => {
      const download: Array<Movie2DownloadListResponse> = [];
      const resolution = selectorContent(elm).children('.resol').text();
      const size = selectorContent(elm).find('.dl_links > b').text().trim();

      selectorContent(elm)
        .find('.dl_links > a')
        .each((i2, elm2) => {
          const server = selectorContent(elm2).text();
          const link = selectorContent(elm2).attr('href');

          download.push({ server, link });
        });

      downloads.push({ resolution, size, download });
    });

    return this.successResponse({
      thumb,
      score,
      quality,
      title,
      year,
      country,
      duration,
      director,
      rating,
      genre,
      synopsis,
      trailer,
      downloads,
    });
  }
}
