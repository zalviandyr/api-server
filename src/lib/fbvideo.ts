import got from 'got';
import { NonPublicVideoError } from '@errors/facebook.error';

export const lowResolution = async (link: string): Promise<string> => {
  const { body } = await got(link);
  try {
    // eslint-disable-next-line prefer-destructuring
    const url = body.split('sd_src:"')[1].split('",hd_tag')[0];
    return url;
  } catch {
    throw new NonPublicVideoError(
      "Either the video is deleted or it's not shared publicly!",
    );
  }
};

export const highResolution = async (link: string): Promise<string> => {
  const { body } = await got(link);
  try {
    // eslint-disable-next-line prefer-destructuring
    const url = body.split('hd_src:"')[1].split('",sd_src:"')[0];
    return url;
  } catch {
    throw new NonPublicVideoError(
      "Either the video is deleted or it's not shared publicly!",
    );
  }
};
