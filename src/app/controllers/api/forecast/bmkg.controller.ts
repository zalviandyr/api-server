import axios from 'axios';
import fsPromise from 'fs/promises';
import { transform as camaroTransform } from 'camaro';
import { Response } from 'express';
import Controller from '@core/Controller';
import { urlProvinsiBMKG } from '@helpers/values';
import { FilePath } from '@helpers/enums';
import { toCamelCase } from '@helpers/utilities';
import ResponseMessage from '@helpers/response-message';

export default class BMKGController extends Controller {
  async infoGempa(): Promise<Response> {
    const url = {
      gempa: 'https://data.bmkg.go.id/DataMKG/TEWS/autogempa.xml',
      image: 'https://data.bmkg.go.id/DataMKG/TEWS/',
    };

    const template = [
      'Infogempa/gempa',
      {
        tanggal: 'Tanggal',
        jam: 'Jam',
        lintang: 'Lintang',
        bujur: 'Bujur',
        magnitude: 'Magnitude',
        kedalaman: 'Kedalaman',
        potensi: 'Potensi',
        wilayah: 'Wilayah',
        dirasakan: 'Dirasakan',
        shakemap: 'Shakemap',
      },
    ];

    const response = await axios({
      url: url.gempa,
      responseType: 'text',
    });
    const transform = await camaroTransform(response.data, template);
    transform[0].shakemap = url.image + transform[0].shakemap;

    return this.successResponse(transform[0]);
  }

  async cuaca(): Promise<Response> {
    const { req } = this;
    const { day } = req.query;
    let { kabupaten } = req.query;

    if (!kabupaten) {
      return this.errorResponse(
        ResponseMessage.queryRequired(['kabupaten'], ['kab bungo']),
      );
    }

    // jika kabupaten nilai nya adalah = kabupaten bungo
    // maka ubah ke = kab bungo
    kabupaten = (() => {
      const temp = (kabupaten as string).toLowerCase().replace(/[^a-z\s]/g, '');
      const tempArray = temp.split(' ');
      if (tempArray[0].startsWith('kabupaten')) return 'kab ' + tempArray[1];
      return temp;
    })();

    // read file kabupaten.json
    const path = FilePath.KabupatenKota;
    const data = await fsPromise.readFile(path, 'utf8');

    const dataJson = JSON.parse(data);
    let url: string | undefined = '';
    for (let i = 0; i < dataJson.length; i++) {
      const newArray = dataJson[i].kabupaten_kota.map((cur: string) =>
        cur.toLowerCase(),
      );

      if (newArray.includes(kabupaten)) {
        const provinsi = toCamelCase(dataJson[i].nama);
        url = urlProvinsiBMKG.find((val) => {
          return val.provinsi == provinsi;
        })?.url;
      }
    }

    if (url) {
      const result = await axios.get(url, { responseType: 'text' });
      const template = [
        '/data/forecast/area',
        {
          name1: 'name[@xml:lang="en_US"]',
          name2: 'name[@xml:lang="id_ID"]',
          humidity: [
            'parameter[@description="Humidity"]/timerange',
            {
              h: '@h',
              datetime: '@datetime',
              percentage: 'value',
            },
          ],
          temperature: [
            'parameter[@description="Temperature"]/timerange',
            {
              h: '@h',
              datetime: '@datetime',
              celsius: 'value[@unit="C"]',
              fahrenheit: 'value[@unit="F"]',
            },
          ],
          weather: [
            'parameter[@description="Weather"]/timerange',
            {
              h: '@h',
              datetime: '@datetime',
              icon: 'value',
            },
          ],
        },
      ];

      // get data using kabupaten
      const transform = await camaroTransform(result.data, template);
      for (let j = 0; j < transform.length; j++) {
        const name2 = transform[j].name2.toLowerCase().replace(/[^a-z\s]/g, '');
        if (name2 === kabupaten) {
          const dataBMKG = transform[j];

          const dateTime = dataBMKG.humidity.map((cur: any) => {
            const rawDateTime = cur.datetime;
            const rawTime = rawDateTime.substring(rawDateTime.length - 4);
            const hour = rawTime.substring(0, 2);
            const minute = rawTime.substring(2, 4);
            const time = hour + ':' + minute;

            const rawDate = rawDateTime.substring(0, rawDateTime.length - 4);
            const dateOfMonth = rawDate.substring(rawDate.length - 2);
            const year = rawDate.substring(0, 4);
            const month = rawDate.substring(year.length, rawDate.length - 2);
            const date = year + '-' + month + '-' + dateOfMonth;

            return date + ' ' + time;
          });
          const humidity = dataBMKG.humidity.map(
            (cur: any) => cur.percentage + '%',
          );
          const temperature = dataBMKG.temperature.map((cur: any) => ({
            celsius: cur.celsius + 'C',
            fahrenheit: cur.fahrenheit + 'F',
          }));
          const weather = dataBMKG.weather.map((cur: any) => {
            let resultWeather;
            if (['0', '100'].includes(cur.icon)) resultWeather = 'Cerah';
            if (['1', '2', '101', '102'].includes(cur.icon))
              resultWeather = 'Cerah Berawan';
            if (['3', '4', '103', '104'].includes(cur.icon))
              resultWeather = 'Berawan';
            if (cur.icon === '5') resultWeather = 'Udara kabur';
            if (cur.icon === '10') resultWeather = 'Asap';
            if (cur.icon === '45') resultWeather = 'Kabut';
            if (cur.icon === '60') resultWeather = 'Hujan ringan';
            if (cur.icon === '61') resultWeather = 'Hujan sedang';
            if (cur.icon === '63') resultWeather = 'Hujan lebat';
            if (cur.icon === '80') resultWeather = 'Hujan lokal';
            if (['95', '97'].includes(cur.icon)) resultWeather = 'Hujan petir';

            return resultWeather;
          });

          // wrap together
          const resultData = [];
          let dayArray = { start: 0, end: 12 };
          if (['1', '2', '3'].includes(day as string)) {
            if (day === '1') dayArray = { start: 0, end: 4 };
            if (day === '2') dayArray = { start: 0, end: 8 };
            if (day === '3') dayArray = { start: 0, end: 12 };
          }

          for (let times = dayArray.start; times < dayArray.end; times++) {
            resultData.push({
              waktu: dateTime[times],
              kelembaban: humidity[times],
              temperatur: temperature[times],
              cuaca: weather[times],
            });
          }

          const resultDataBMKG = {
            nama1: transform[j].name1,
            nama2: transform[j].name2,
            data: resultData,
          };

          return this.successResponse(resultDataBMKG);
        }
      }
    }

    throw new Error('Bermasalah pada URL provinsi BMKG');
  }
}
