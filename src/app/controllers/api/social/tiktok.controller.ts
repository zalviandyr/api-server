import { Response } from 'express';
import puppeteer from 'puppeteer';
import Controller from '@core/Controller';
import { puppeteerValues } from '@helpers/values';
import ResponseMessage from '@helpers/response-message';

export default class TiktokController extends Controller {
  async tiktok(): Promise<Response> {
    const { req } = this;
    const { url } = req.query;

    if (!url) {
      return this.errorResponse(ResponseMessage.queryRequired(['url']));
    }

    const automationUrl = 'https://snaptik.app';
    const browser = await puppeteer.launch(puppeteerValues.options);
    const page = await browser.newPage();

    try {
      // set user agent
      await page.setUserAgent(puppeteerValues.userAgent);
      await page.goto(automationUrl);

      await page.waitForSelector('input#url');
      await page.type('input#url', url as string);
      await page.click('button[type="submit"]');
      const downloadSelector = '#download-block > div > a';
      await page.waitForSelector(downloadSelector);
      const thumb = await page.$eval('.snaptik-left > img', (pageEval) =>
        pageEval.getAttribute('src'),
      );
      const title = await page.$eval(
        '.snaptik-middle > h3',
        (pageEval) => pageEval.textContent,
      );
      const description = await page.$eval(
        '.snaptik-middle > p > span',
        (pageEval) => pageEval.textContent,
      );
      const download = await page.$$eval(downloadSelector, (pageEval) => {
        const downloads = [];
        for (let i = 0; i < pageEval.length; i++) {
          downloads.push(pageEval[i].getAttribute('href'));
        }
        return downloads;
      });

      const result = {
        thumb,
        title,
        description,
        download,
      };

      return this.successResponse(result, 'Success get data', 200, () =>
        browser.close(),
      );
    } catch (err) {
      return this.errorResponse(err.message, 400, () => browser.close());
    }
  }
}
