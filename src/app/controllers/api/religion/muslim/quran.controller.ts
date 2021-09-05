import { Response } from 'express';
import axios from 'axios';
import Controller from '@core/Controller';

export default class QuranController extends Controller {
  async quran(): Promise<Response> {
    const url = 'https://quran-endpoint.herokuapp.com/quran';
    const { data } = await axios.get(url);

    const result = data.data.map((val: any) => {
      return {
        surat: val.asma.id.short,
        asma: val.asma.ar.short,
        surat_ke: val.number,
        arti: val.asma.translation.id,
        tipe: val.type.id,
        keterangan: val.tafsir.id,
        jumlah_ayat: val.ayahCount,
        audio_url_full: val.recitation.full,
      };
    });

    return this.successResponse(result);
  }

  async quranSurat(): Promise<Response> {
    const { req } = this;
    const { surat } = req.params;

    const urlSurat = `https://quran-endpoint.herokuapp.com/quran/${surat}`;
    const { data } = await axios.get(urlSurat);
    const json = data.data;
    const resultResponse = {
      surat: json.asma.id.short,
      asma: json.asma.ar.short,
      surat_ke: json.number,
      arti: json.asma.translation.id,
      tipe: json.type.id,
      keterangan: json.tafsir.id,
      jumlah_ayat: json.ayahCount,
      audio_url_full: json.recitation.full,
    };

    return this.successResponse(resultResponse);
  }

  async quranSuratAyat(): Promise<Response> {
    const { req } = this;
    const { surat } = req.params;
    const urlAyat = `https://quran-endpoint.herokuapp.com/quran/${surat}`;
    const { data } = await axios.get(urlAyat);
    const json = data.data;
    const resultResponse = {
      surat: json.asma.id.short,
      asma: json.asma.ar.short,
      surat_ke: json.number,
      arti: json.asma.translation.id,
      tipe: json.type.id,
      keterangan: json.tafsir.id,
      jumlah_ayat: json.ayahCount,
      audio_url_full: json.recitation.full,
      ayat: json.ayahs.map((val: any) => {
        return {
          ayat_ke: val.number.insurah,
          teks_id: val.translation.id,
          teks_ar: val.text.ar,
          audio_url: val.audio.url,
        };
      }),
    };

    return this.successResponse(resultResponse);
  }
}
