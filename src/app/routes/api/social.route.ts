import { Router as ExpressRouter } from 'express';
import Router from '@core/Router';
import InstagramController from '@api/social/instagram.controller';
import FacebookController from '@api/social/facebook.controller';
import YoutubeController from '@api/social/youtube.controller';
import TiktokController from '@api/social/tiktok.controller';

export default class SocialRoute extends Router {
  route(): Array<ExpressRouter> {
    return [
      this.get('/tiktok', TiktokController, 'tiktok'),
      this.get('/ig', InstagramController, 'ig'),
      this.get('/ig-profile', InstagramController, 'igProfile'),
      this.get('/fb-video', FacebookController, 'fbVideo'),
      this.get('/yt-search', YoutubeController, 'ytSearch'),
      this.get('/yt-audio', YoutubeController, 'ytAudio'),
      this.get('/yt-video', YoutubeController, 'ytVideo'),
    ];
  }
}
