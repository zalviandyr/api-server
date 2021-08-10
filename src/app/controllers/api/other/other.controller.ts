import { Response } from 'express';
import axios from 'axios';
import cheerio from 'cheerio';
import puppeteer from 'puppeteer';
import translate from '@k3rn31p4nic/google-translate-api';
import SaweriaClient from 'saweria';
import Controller from '@core/Controller';
import { authentication, puppeteerValues } from '@helpers/values';
import ResponseMessage from '@helpers/response-message';

export default class OtherController extends Controller {
  async bosan(): Promise<Response> {
    const url = 'https://www.boredapi.com/api/activity';

    const { data } = await axios.get(url);
    const translateResult = await translate(data.activity, { to: 'id' });
    return this.successResponse({
      activity: data.activity,
      translate: translateResult.text,
      type: data.type,
    });
  }

  async meme(): Promise<Response> {
    const url = 'https://meme-api.herokuapp.com/gimme';
    const { data } = await axios.get(url);
    return this.successResponse({
      post_link: data.postLink,
      subreddit: data.subreddit,
      title: data.title,
      author: data.author,
      url: data.url,
    });
  }

  async saweria(): Promise<Response> {
    const client = new SaweriaClient();
    await client.login(
      authentication.saweria.email,
      authentication.saweria.password,
    );
    const transactions = await client.getTransaction();
    const user = await client.getUser();

    const result = {
      username: user.username,
      link: 'https://saweria.co/' + user.username,
      description: user.description,
      profile_picture: user.profilePicture,
      social: {
        facebook: user.socials.facebook,
        instagram: user.socials.instagram,
        twitch: user.socials.twitch,
        twitter: user.socials.twitter,
        youtube: user.socials.youtube,
      },
      transactions,
    };
    return this.successResponse(result);
  }

  async lirik(): Promise<Response> {
    const { req } = this;
    const { search } = req.query;
    if (!search) {
      return this.errorResponse(
        ResponseMessage.queryRequired(['search'], ['mitis moments']),
      );
    }

    const url = `https://lirik.web.id/results/?q=${search}`;
    const browser = await puppeteer.launch(puppeteerValues.options);
    const page = await browser.newPage();

    try {
      // set user agent
      await page.setUserAgent(puppeteerValues.userAgent);
      await page.goto(url);

      const xpathResult = '//div[@id="siteloader"]';
      await page.waitForXPath(xpathResult);
      const [elementsResult] = await page.$x(xpathResult);
      const firstResultUrl = await page.evaluate((element) => {
        const searchResult = element.querySelectorAll('p');
        if (searchResult.length === 0) {
          return null;
        }
        // return first result
        return searchResult[0].querySelector('a').getAttribute('href');
      }, elementsResult);

      if (firstResultUrl) {
        await page.goto(firstResultUrl);

        const xpathMainContent = '//div[@class="entry-content"]';
        await page.waitForXPath(xpathMainContent);
        const [elementsMainContent] = await page.$x(xpathMainContent);
        const mainContentResult = await page.evaluate((element) => {
          const lyricParagraph = element.querySelectorAll('p');
          const title = element.querySelector('h1.entry-title').innerText;

          const temp = [];
          // minus 1, because no need last element
          for (let i = 0; i < lyricParagraph.length - 1; i++) {
            temp.push(lyricParagraph[i].innerText);
          }

          return { title, lyric: temp };
        }, elementsMainContent);

        return this.successResponse(
          mainContentResult,
          'Success get lirik',
          200,
          () => browser.close(),
        );
      }

      return this.errorResponse(ResponseMessage.notFound, 404, () =>
        browser.close(),
      );
    } catch (err) {
      return this.errorResponse(err.message, 400, () => browser.close());
    }
  }

  async wiki(): Promise<Response> {
    const { req } = this;
    const { search } = req.query;
    if (!search) {
      return this.errorResponse(
        ResponseMessage.queryRequired(['search'], ['linux']),
      );
    }

    try {
      const url = `https://id.wikipedia.org/wiki/${search}`;
      const { data } = await axios.get(url);
      const selector = cheerio.load(data);
      const result = selector('div[class="mw-parser-output"]');
      const title = selector('h1[id="firstHeading"]');

      const paragraph = result.find('div[id="toc"]').prevUntil('table, div');
      const textArray = paragraph
        .text()
        .split('\n')
        .reverse()
        .filter((el) => el !== '');
      const textClean = textArray.map((el) => el.replace(/\[([0-9]+)\]/g, ''));

      return this.successResponse({ title: title.text(), result: textClean });
    } catch (err) {
      if (err.response.status === 404) {
        return this.errorResponse(ResponseMessage.notFound);
      }

      throw new Error(err.message);
    }
  }
}
