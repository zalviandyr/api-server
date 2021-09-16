import { Response } from 'express';
import axios from 'axios';
import fsPromise from 'fs/promises';
import Controller from '@core/Controller';
import Filepath from '@helpers/filepath';
import ResponseMessage from '@helpers/response-message';

export default class MuslimController extends Controller {
  async jadwalShalat(): Promise<Response> {
    const url =
      'https://raw.githubusercontent.com/lakuapik/jadwalsholatorg/master/kota.json';
    const { data } = await axios.get(url);
    return this.successResponse(data);
  }

  async jadwalShalatKota(): Promise<Response> {
    const { req } = this;
    const { kota } = req.params;

    const today = new Date().toISOString().slice(0, 10).split('-');
    const url = `https://raw.githubusercontent.com/lakuapik/jadwalsholatorg/master/adzan/${kota}/${today[0]}/${today[1]}.json`;

    const { data } = await axios.get(url);
    return this.successResponse(data);
  }

  async bacaanShalat(): Promise<Response> {
    const path = Filepath.muslim.shalat.bacaan;
    const data = await fsPromise.readFile(path, 'utf8');
    return this.successResponse(JSON.parse(data));
  }

  async niatShalat(): Promise<Response> {
    const path = Filepath.muslim.shalat.niat;
    const data = await fsPromise.readFile(path, 'utf8');
    return this.successResponse(JSON.parse(data));
  }

  async asmaulHusna(): Promise<Response> {
    const path = Filepath.muslim.asmaulHusna;
    const data = await fsPromise.readFile(path, 'utf8');
    return this.successResponse(JSON.parse(data));
  }

  async qiblat(): Promise<Response> {
    const { req } = this;
    const { lat, long } = req.query;

    if (!lat && !long) {
      return this.errorResponse(
        ResponseMessage.queryRequired(['lat', 'long'], ['123', '123']),
      );
    }

    const url = `http://api.aladhan.com/v1/qibla/${lat}/${long}`;
    const { data } = await axios.get(url);
    const result = data.data;
    const resultResponse = {
      latitude: result.latitude,
      longitude: result.longitude,
      direction: result.direction,
    };
    return this.successResponse(resultResponse);
  }
}
