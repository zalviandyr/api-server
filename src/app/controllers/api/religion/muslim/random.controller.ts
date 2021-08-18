import { Response } from 'express';
import axios from 'axios';
import fsPromise from 'fs/promises';
import Controller from '@core/Controller';
import Filepath from '@helpers/filepath';

export default class RandomController extends Controller {
  async ayat(): Promise<Response> {
    const url = 'https://api.banghasan.com/quran/format/json/acak';
    const { data } = await axios.get(url);

    return this.successResponse({
      surat: data.surat.nama,
      asma: data.surat.asma,
      surat_ke: data.surat.nomor,
      arti: data.surat.arti,
      tipe: data.surat.type,
      keterangan: data.surat.keterangan,
      jumlah_ayat: data.surat.ayat,
      rukuk: data.surat.rukuk,
      ayat: {
        ayat_ke: data.acak.id.ayat,
        teks_id: data.acak.id.teks,
        teks_ar: data.acak.ar.teks,
      },
    });
  }

  async asmaulHusna(): Promise<Response> {
    const path = Filepath.muslim.asmaulHusna;
    const data = await fsPromise.readFile(path, 'utf8');
    const json = JSON.parse(data);
    const random = Math.floor(Math.random() * json.length);
    return this.successResponse(json[random]);
  }

  async quote(): Promise<Response> {
    const path = Filepath.quotes.quotesAgamis;
    const data = await fsPromise.readFile(path, 'utf8');
    const json = JSON.parse(data);
    const random = Math.floor(Math.random() * json.length);
    return this.successResponse(json[random]);
  }

  async wallpaper(): Promise<Response> {
    const path = Filepath.muslim.wallpaper;
    const data = await fsPromise.readFile(path, 'utf8');
    const json = JSON.parse(data);
    const random = Math.floor(Math.random() * json.length);
    return this.successResponse(json[random]);
  }
}
