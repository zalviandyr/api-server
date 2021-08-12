import { Response } from 'express';
import fsPromise from 'fs/promises';
import Controller from '@core/Controller';
import Filepath from '@helpers/filepath';

export default class DoaController extends Controller {
  async ayatKursi(): Promise<Response> {
    const path = Filepath.muslim.doa.ayatKursi;
    const data = await fsPromise.readFile(path, 'utf8');
    return this.successResponse(JSON.parse(data).data);
  }

  async harian(): Promise<Response> {
    const path = Filepath.muslim.doa.harian;
    const data = await fsPromise.readFile(path, 'utf8');
    return this.successResponse(JSON.parse(data).data);
  }

  async tahlil(): Promise<Response> {
    const path = Filepath.muslim.doa.tahlil;
    const data = await fsPromise.readFile(path, 'utf8');
    return this.successResponse(JSON.parse(data).data);
  }

  async wirid(): Promise<Response> {
    const path = Filepath.muslim.doa.wirid;
    const data = await fsPromise.readFile(path, 'utf8');
    return this.successResponse(JSON.parse(data).data);
  }
}
