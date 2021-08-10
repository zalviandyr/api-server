import { Response } from 'express';
import axios from 'axios';
import Controller from '@core/Controller';

export default class MuslimController extends Controller {
  async jadwalSholat(): Promise<Response> {
    const url =
      'https://raw.githubusercontent.com/lakuapik/jadwalsholatorg/master/kota.json';
    const { data } = await axios.get(url);
    return this.successResponse(data);
  }

  async jadwalSholatKota(): Promise<Response> {
    const { req } = this;
    const { kota } = req.params;

    const today = new Date().toISOString().slice(0, 10).split('-');
    const url = `https://raw.githubusercontent.com/lakuapik/jadwalsholatorg/master/adzan/${kota}/${today[0]}/${today[1]}.json`;

    const { data } = await axios.get(url);
    const dateToday = parseInt(today[2]) - 1;
    return this.successResponse(data[dateToday]);
  }
}
