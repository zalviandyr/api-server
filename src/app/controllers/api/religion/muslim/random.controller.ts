import { Response } from 'express';
import axios from 'axios';
import Controller from '@core/Controller';

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
}
