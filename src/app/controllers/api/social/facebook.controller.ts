import { Response } from 'express';
import Controller from '@core/Controller';
import { lowResolution } from '@lib/fbvideo';
import ResponseMessage from '@helpers/response-message';

export default class FacebookController extends Controller {
  async fbVideo(): Promise<Response> {
    const { req } = this;
    const { url } = req.query;

    if (!url) {
      return this.errorResponse(
        ResponseMessage.queryRequired(['url'], ['https://facebook.com/video']),
      );
    }

    const link = await lowResolution(url as string);
    return this.successResponse(link);
  }
}
