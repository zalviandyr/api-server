import ffmpeg, { FfmpegCommand } from 'fluent-ffmpeg';
import ffmpegPath from '@ffmpeg-installer/ffmpeg';
import { Readable } from 'stream';

export const toCamelCase = (str: string): string => {
  return str
    .replace(/\s(.)/g, ($1) => $1.toUpperCase())
    .replace(/\s/g, '')
    .replace(/^(.)/, ($1) => $1.toLowerCase());
};

export const toMp3 = (streamData: Readable): Promise<FfmpegCommand> =>
  new Promise((resolve, rejects) => {
    ffmpeg.setFfmpegPath(ffmpegPath.path);
    const resultStream = ffmpeg(streamData)
      .toFormat('mp3')
      .on('error', (err) => {
        rejects(err);
      });

    resolve(resultStream);
  });
