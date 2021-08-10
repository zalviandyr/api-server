import { Response } from 'express';
import axios from 'axios';
import Controller from '@core/Controller';

export default class QuranController extends Controller {
  async quran(): Promise<Response> {
    const url = 'https://api.banghasan.com/quran/format/json/surat';
    const { data } = await axios.get(url);

    const result = data.hasil.map((val: any) => {
      return {
        surat: val.nama,
        asma: val.asma,
        surat_ke: val.nomor,
        arti: val.arti,
        tipe: val.type,
        keterangan: val.keterangan,
        jumlah_ayat: val.ayat,
        rukuk: val.rukuk,
      };
    });

    return this.successResponse(result);
  }

  async quranSurat(): Promise<Response> {
    const { req } = this;
    const { surat } = req.params;

    const urlSurat = `https://api.banghasan.com/quran/format/json/surat/${surat}`;
    const { data } = await axios.get(urlSurat);
    const [json] = data.hasil;
    const resultResponse = {
      surat: json.nama,
      asma: json.asma,
      surat_ke: json.nomor,
      arti: json.arti,
      tipe: json.type,
      keterangan: json.keterangan,
      jumlah_ayat: json.ayat,
      rukuk: json.rukuk,
    };

    return this.successResponse(resultResponse);
  }

  async quranSuratAyat(): Promise<Response> {
    const { req } = this;
    const { surat, ayat } = req.params;
    const urlAyat = `https://api.banghasan.com/quran/format/json/surat/${surat}/ayat/${ayat}`;
    const { data } = await axios.get(urlAyat);
    const jsonAyat = data.ayat;
    const resultResponse = {
      surat: data.surat.nama,
      asma: data.surat.asma,
      surat_ke: data.surat.nomor,
      arti: data.surat.arti,
      tipe: data.surat.type,
      keterangan: data.surat.keterangan,
      jumlah_ayat: data.surat.ayat,
      rukuk: data.surat.rukuk,
      ayat: jsonAyat.proses.map((val: number) => {
        return {
          ayat_ke: val,
          teks_id: jsonAyat.data.id[val - 1].teks,
          teks_ar: jsonAyat.data.ar[val - 1].teks,
        };
      }),
    };

    return this.successResponse(resultResponse);
  }
}
