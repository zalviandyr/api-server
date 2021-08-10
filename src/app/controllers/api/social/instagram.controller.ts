import axios from 'axios';
import { Response } from 'express';
import puppeteer from 'puppeteer';
import Controller from '@core/Controller';
import { puppeteerValues } from '@helpers/values';
import { authentication } from '@helpers/values';
import ResponseMessage from '@helpers/response-message';

export default class InstagramController extends Controller {
  async igProfile(): Promise<Response> {
    const { req } = this;
    const { username } = req.query;

    if (!username) {
      return this.errorResponse(
        ResponseMessage.queryRequired(['username'], ['zukronalviandy11']),
      );
    }

    const url = `https://igblade.com/api/v2/accounts/${username}`;
    const result = await axios.get(url, {
      headers: { Authorization: `Bearer ${authentication.igBlade.bearer}` },
      responseType: 'json',
    });

    const { profile } = result.data;
    const resultResponse = {
      username: profile.username,
      name: profile.name,
      biography: profile.biography,
      profile_picture: profile.profile_picture,
      is_private: profile.is_private,
      is_verified: profile.is_verified,
      follower: profile.follower_count,
      following: profile.following_count,
      external_url: profile.external_url,
      posts: profile.media_count,
    };

    return this.successResponse(resultResponse);
  }

  async ig(): Promise<Response> {
    const { req } = this;
    const { url } = req.query;
    if (!url) {
      return this.errorResponse(ResponseMessage.queryRequired(['url']));
    }

    const urlInstagram = 'https://keeppost.com/';
    const browser = await puppeteer.launch(puppeteerValues.options);
    const page = await browser.newPage();

    try {
      // set user agent
      await page.setUserAgent(puppeteerValues.userAgent);
      await page.goto(urlInstagram);
      await page.type('input#dg-url', url as string);
      await page.click('input#dg-submit');
      await page.waitForSelector('div.success');
      const result = await page.$eval('div.success > a', (el) =>
        el.getAttribute('href'),
      );

      return this.successResponse(result, 'Success get link', 200, () =>
        browser.close(),
      );
    } catch (err) {
      return this.errorResponse(err.message, 400, () => browser.close());
    }
  }
}
