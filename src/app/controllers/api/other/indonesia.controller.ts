import { Response } from 'express';
import axios from 'axios';
import fsPromise from 'fs/promises';
import Controller from '@core/Controller';
import Filepath from '@helpers/filepath';
import ResponseMessage from '@helpers/response-message';

export default class IndonesiaController extends Controller {
  async covidIndonesia(): Promise<Response> {
    const url = 'https://apicovid19indonesia-v2.vercel.app/api/indonesia';

    const { data } = await axios.get(url);
    const localDate = new Date(data.lastUpdate);
    const lastUpdate = localDate.toLocaleString();

    return this.successResponse({
      positif: data.positif,
      dirawat: data.dirawat,
      sembuh: data.sembuh,
      meninggal: data.meninggal,
      last_update: lastUpdate,
    });
  }

  async kabupatenKota(): Promise<Response> {
    const result = await fsPromise.readFile(
      Filepath.indonesia.kabupatenKota,
      'utf8',
    );
    return this.successResponse(JSON.parse(result));
  }

  async kabupatenKotaProvinsi(): Promise<Response> {
    const { req } = this;
    const { provinsi } = req.params;

    const result = await fsPromise.readFile(
      Filepath.indonesia.kabupatenKota,
      'utf8',
    );
    const json = JSON.parse(result);
    for (let i = 0; i < json.length; i++) {
      if (provinsi.toLowerCase() === json[i].nama.toLowerCase()) {
        return this.successResponse(json[i]);
      }
    }

    return this.errorResponse(ResponseMessage.notFound, 404);
  }
}
