import { Request, Response } from 'express';
import { FfmpegCommand } from 'fluent-ffmpeg';
import { Writable } from 'stream';
import ResponseInterface from '@interfaces/response.interface';

export default class Controller {
  protected req: Request;
  protected res: Response;

  constructor(req: Request, res: Response) {
    this.req = req;
    this.res = res;
  }

  protected successResponse(
    result: unknown,
    message = 'Sukses mengambil data',
    statusCode = 200,
    callback?: () => void,
  ): Response {
    if (callback !== undefined) callback();

    const { res } = this;
    const response: ResponseInterface = {
      status_code: statusCode,
      message,
      result,
    };
    return res.status(statusCode).json(response);
  }

  protected successStreamResponse(
    streamData: FfmpegCommand,
    fileName: string,
    statusCode = 200,
  ): Writable {
    const { res } = this;
    res.header('Content-Disposition', `attachment; filename=${fileName}`);
    res.status(statusCode);
    return streamData.pipe(res);
  }

  protected errorResponse(
    message = 'Request failed',
    statusCode = 400,
    callback?: () => void,
  ): Response {
    if (callback !== undefined) callback();

    const { res } = this;
    const response: ResponseInterface = {
      status_code: statusCode,
      message,
      result: null,
    };
    return res.status(statusCode).json(response);
  }
}
