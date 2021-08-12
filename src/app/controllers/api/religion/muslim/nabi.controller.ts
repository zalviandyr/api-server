import { Response } from 'express';
import fsPromise from 'fs/promises';
import fs from 'fs';
import Controller from '@core/Controller';
import Filepath from '@helpers/filepath';
import ResponseMessage from '@helpers/response-message';

export default class NabiController extends Controller {
  async list(): Promise<Response> {
    const path = Filepath.muslim.nabi.list;
    const data = await fsPromise.readFile(path, 'utf8');
    return this.successResponse(JSON.parse(data));
  }

  async kisah(): Promise<Response> {
    const { req } = this;
    const { slugNabi } = req.params;

    const path = Filepath.muslim.nabi.kisah(slugNabi);
    const isExist = fs.existsSync(path);
    if (!isExist) {
      return this.errorResponse(ResponseMessage.notFound, 404);
    }

    const data = await fsPromise.readFile(path, 'utf8');
    return this.successResponse(JSON.parse(data));
  }
}
