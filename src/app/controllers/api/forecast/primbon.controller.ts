import { Response } from 'express';
import axios from 'axios';
import cheerio from 'cheerio';
import moment from 'moment';
import querystring from 'querystring';
import Controller from '@core/Controller';
import ResponseMessage from '@helpers/response-message';

export default class PrimbonController extends Controller {
  async artiNama(): Promise<Response> {
    const { req } = this;
    const { nama } = req.query;
    if (!nama) {
      return this.errorResponse(ResponseMessage.queryRequired(['nama']));
    }

    const url = `https://www.primbon.com/arti_nama.php?nama1=${nama}&proses=+Submit%21+`;
    const { data } = await axios.get(url);
    const selector = cheerio.load(data);
    const result = selector('div[id="container"]').find('div[id="body"]');

    // remove unnecessary data
    const dataTrim = result
      .text()
      .split('Nama:')[0]
      .trim()
      .replace('ARTI NAMA', '');
    const dataSplit = dataTrim.split('\n\n');

    return this.successResponse({
      arti: dataSplit[0].trim(),
      deskripsi: dataSplit[1].trim(),
    });
  }

  async pasangan(): Promise<Response> {
    const { req } = this;
    const { nama1, nama2 } = req.query;
    if (!nama1 && !nama2) {
      return this.errorResponse(
        ResponseMessage.queryRequired(['nama1', 'nama2'], ['ucup', 'otong']),
      );
    }

    const url = `https://www.primbon.com/kecocokan_nama_pasangan.php?nama1=${nama1}&nama2=${nama2}&proses=+Submit!+`;
    const { data } = await axios.get(url);
    const selector = cheerio.load(data);
    const result = selector('div[id="container"]').find('div[id="body"]');

    // remove unnecessary data
    result.find('br').replaceWith('\n');
    const dataText = result.text();
    const removeEmpty = dataText.split('\n').filter((e) => e !== '');
    const removeUnnecessary = removeEmpty.splice(1).splice(0, 5);
    const [
      namaAnda,
      namaPasangan,
      sisiPositifAnda,
      sisiNegatifAnda,
      deskripsi,
    ] = removeUnnecessary;

    return this.successResponse({
      nama_anda: namaAnda.split(':')[1].trim(),
      nama_pasangan: namaPasangan.split(':')[1].trim(),
      sisi_positif_anda: sisiPositifAnda.split(':')[1].trim(),
      sisi_negatif_anda: sisiNegatifAnda.split(':')[1].trim(),
      deskripsi,
    });
  }

  async pekerjaan(): Promise<Response> {
    const { req } = this;
    const { tanggal } = req.query;
    if (!tanggal) {
      return this.errorResponse(
        ResponseMessage.queryRequired(['tanggal'], ['01-12-2020']),
      );
    }

    // check date is valid
    const m = moment(tanggal as string, 'DD-MM-YYYY');
    const url = 'https://primbon.com/pekerjaan_weton_lahir.php';
    if (!m.isValid()) {
      return this.errorResponse(
        ResponseMessage.queryRequired(['tanggal'], ['01-12-2020']),
      );
    }

    const dataPost = {
      tgl: m.date(),
      bln: m.month() + 1,
      thn: m.year(),
      submit: 'Submit!',
    };
    const { data } = await axios.post(url, querystring.stringify(dataPost));
    const selector = cheerio.load(data);
    const result = selector('div[id="container"]').find('div[id="body"]');

    // remove unnecessary data
    result.find('br').replaceWith('\n');
    const dataText = result.text();
    const array = dataText.split('\n').filter((f) => f !== '');
    return this.successResponse({
      hari_lahir: array[1].split(':')[1].trim(),
      deskripsi: array[2],
    });
  }

  async penyakit(): Promise<Response> {
    const { req } = this;
    const { tanggal } = req.query;
    if (!tanggal) {
      return this.errorResponse(
        ResponseMessage.queryRequired(['tanggal'], ['01-12-2020']),
      );
    }

    // check date is valid
    const m = moment(tanggal as string, 'DD-MM-YYYY');
    const url = 'https://primbon.com/cek_potensi_penyakit.php';
    if (!m.isValid()) {
      return this.errorResponse(
        ResponseMessage.queryRequired(['tanggal'], ['01-12-2020']),
      );
    }

    const dataPost = {
      tanggal: m.date(),
      bulan: m.month() + 1,
      tahun: m.year(),
      hitung: 'Submit!',
    };
    const { data } = await axios.post(url, querystring.stringify(dataPost));
    const selector = cheerio.load(data);
    const result = selector('div[id="container"]').find('div[id="body"]');
    const resultList = selector('div[id="container"]').find(
      'div[id="body"] > ul > li',
    );

    // remove unnecessary data
    result.find('br').replaceWith('\n');
    const dataText = result.text();
    const array = dataText.split('\n');
    const indexToSplice = array.findIndex((f) => f === 'Sektor yg dianalisa:');
    const getArrayFromIndex = array.splice(indexToSplice, array.length);
    const indexToSplice2 = getArrayFromIndex.findIndex(
      (f) => f.includes('Anda tidak memiliki') || f.includes('Anda memiliki'),
    );
    const getArrayFromIndex2 = getArrayFromIndex
      .splice(0, indexToSplice2 + 1)
      .filter((f) => f !== '');

    const deskripsi = getArrayFromIndex2[getArrayFromIndex2.length - 1];
    const analisa = getArrayFromIndex2.splice(1, getArrayFromIndex2.length - 2);
    const penyakit: Array<string> = [];
    resultList.each((index, elm) => {
      penyakit[index] = selector(elm).text();
    });

    return this.successResponse({
      analisa,
      deskripsi,
      penyakit,
    });
  }
}
