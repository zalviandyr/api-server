import { Response } from 'express';
import puppeteer from 'puppeteer';
import Controller from '@core/Controller';
import { puppeteerValues } from '@helpers/values';
import ResponseMessage from '@helpers/response-message';

export default class YoutubeController extends Controller {
  async ytSearch(): Promise<Response> {
    const { req } = this;
    const { search } = req.query;

    if (!search) {
      return this.errorResponse(
        ResponseMessage.queryRequired(['search'], ['mitis moments']),
      );
    }

    const url = `https://www.youtube.com/results?search_query=${search}`;
    const browser = await puppeteer.launch(puppeteerValues.options);
    const page = await browser.newPage();

    try {
      // set user agent
      await page.setUserAgent(puppeteerValues.userAgent);
      await page.goto(url, { waitUntil: 'networkidle0' });

      const xpathSearchResult =
        '//ytd-item-section-renderer[@class="style-scope ytd-section-list-renderer"]/div[@id="contents"]';
      await page.waitForXPath(xpathSearchResult);
      // tunggu sampai badge durasi ada, terkadang badge lambat muncul
      await page.waitForXPath(
        '//*[@id="overlays"]/ytd-thumbnail-overlay-time-status-renderer',
      );
      const [elementsSearchResult] = await page.$x(xpathSearchResult);
      const result = await page.evaluate((element) => {
        const searchResult = element.querySelectorAll('ytd-video-renderer');

        let elementVideo;
        // cek jika video tidak live, video live tidak mempunyai durasi
        for (let i = 0; i < searchResult.length; i++) {
          const tempDuration = searchResult[i].querySelector(
            'div > ytd-thumbnail > a > div > ytd-thumbnail-overlay-time-status-renderer',
          );
          if (tempDuration) {
            elementVideo = searchResult[i];
            break;
          }
        }

        const thumb = elementVideo
          .querySelector('div > ytd-thumbnail > a > yt-img-shadow > img')
          .getAttribute('src');
        const duration = elementVideo.querySelector(
          'div > ytd-thumbnail > a > div > ytd-thumbnail-overlay-time-status-renderer',
        ).innerText;
        const title = elementVideo.querySelector(
          'div > div > div > div > h3',
        ).innerText;
        const link = (() => {
          const temp = elementVideo
            .querySelector('div > div > div > div > h3 > a')
            .getAttribute('href');
          return 'https://www.youtube.com' + temp;
        })();

        const views = elementVideo.querySelector(
          'div > div > div#meta > ytd-video-meta-block > div#metadata > div#metadata-line > span:nth-child(1)',
        ).textContent;

        const upload = elementVideo.querySelector(
          'div > div > div#meta > ytd-video-meta-block > div#metadata > div#metadata-line > span:nth-child(2)',
        ).textContent;

        const channelLink = (() => {
          const temp = elementVideo
            .querySelector('div > div > div#channel-info > a')
            .getAttribute('href');
          return 'https://www.youtube.com' + temp;
        })();

        const channelTitle = elementVideo.querySelector(
          'div > div > div#channel-info > ytd-channel-name',
        ).innerText;

        const description = elementVideo.querySelector(
          'div > div > yt-formatted-string.metadata-snippet-text',
        ).innerText;

        return {
          thumb,
          title,
          duration,
          link,
          views,
          upload,
          channel_link: channelLink,
          channel_title: channelTitle,
          description,
        };
      }, elementsSearchResult);

      // remove all query string
      [result.thumb] = result.thumb.split(/[?#]/);
      return this.successResponse(result, 'Success get data', 200, () =>
        browser.close(),
      );
    } catch (err) {
      return this.errorResponse(err.message, 400, () => browser.close());
    }
  }

  async ytAudio(): Promise<Response> {
    const { req } = this;
    const { url } = req.query;

    if (!url) {
      return this.errorResponse(ResponseMessage.queryRequired(['url']));
    }

    const automationUrl = 'https://yt1s.com';
    const browser = await puppeteer.launch(puppeteerValues.options);
    const page = await browser.newPage();

    try {
      // set user agent
      await page.setUserAgent(puppeteerValues.userAgent);
      await page.goto(automationUrl);

      // input url youtube
      await page.waitForSelector('#s_input');
      await (await page.$('#s_input'))?.type(url as string);

      // convert
      await page.waitForSelector('.btn-red');
      await (await page.$('.btn-red'))?.click();

      // select mp3 and get size
      await page.waitForSelector('[label="mp3"]');
      const size = await page.$eval('[label="mp3"]', (pageEval) => {
        const options = pageEval.querySelectorAll('option');

        options[0].selected = true;
        const text = options[0].textContent;
        const array = text?.split('(')[1];
        return array?.replace(')', '').trim();
      });

      // get link
      await page.waitForSelector('#btn-action');
      await (await page.$('#btn-action'))?.click();

      // get link download
      await page.waitForSelector('#asuccess', { visible: true });
      const downloadLink = await page.$eval('#asuccess', (pageEval) =>
        pageEval.getAttribute('href'),
      );

      // get title
      const title = await page.$eval(
        '.clearfix > h3',
        (pageEval) => pageEval.textContent,
      );

      // get duration
      const duration = await page.$eval(
        '.clearfix > .mag0',
        (pageEval) => pageEval.textContent,
      );

      return this.successResponse(
        {
          title,
          size,
          duration,
          ext: 'mp3',
          url: downloadLink,
        },
        'Success get downloadable link',
        200,
        () => browser.close(),
      );
    } catch (err) {
      return this.errorResponse(err.message, 400, () => browser.close());
    }
  }

  async ytVideo(): Promise<Response> {
    const { req } = this;
    const { url } = req.query;

    if (!url) {
      return this.errorResponse(ResponseMessage.queryRequired(['url']));
    }

    const automationUrl = 'https://yt1s.com';
    const browser = await puppeteer.launch(puppeteerValues.options);
    const page = await browser.newPage();

    try {
      // set user agent
      await page.setUserAgent(puppeteerValues.userAgent);
      await page.goto(automationUrl);

      // input url youtube
      await page.waitForSelector('#s_input');
      await (await page.$('#s_input'))?.type(url as string);

      // convert
      await page.waitForSelector('.btn-red');
      await (await page.$('.btn-red'))?.click();

      // select 480p and get size
      await page.waitForSelector('[label="mp4"]');
      const size = await page.$eval('[label="mp4"]', (el) => {
        let result = '';
        const options = el.querySelectorAll('option');
        for (let i = 0; i < options.length; i++) {
          if (options[i].textContent?.includes('480')) {
            options[i].selected = true;

            const text = options[i].textContent;
            const array = text?.split('(')[1];
            result = array?.replace(')', '').trim() ?? '';
          }
        }

        return result;
      });

      // get link
      await page.waitForSelector('#btn-action');
      await (await page.$('#btn-action'))?.click();

      // get link download
      await page.waitForSelector('#asuccess', { visible: true });
      const downloadLink = await page.$eval('#asuccess', (pageEval) =>
        pageEval.getAttribute('href'),
      );

      // get title
      const title = await page.$eval(
        '.clearfix > h3',
        (pageEval) => pageEval.textContent,
      );

      // get duration
      const duration = await page.$eval(
        '.clearfix > .mag0',
        (el) => el.textContent,
      );

      return this.successResponse(
        {
          title,
          size,
          res: '480p',
          duration,
          ext: 'mp4',
          url: downloadLink,
        },
        'Success get data',
        200,
        () => browser.close(),
      );
    } catch (err) {
      return this.errorResponse(err.message, 400, () => browser.close());
    }
  }
}
