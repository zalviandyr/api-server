import { Response } from 'express';
import axios from 'axios';
import fsPromise from 'fs/promises';
import translate from '@k3rn31p4nic/google-translate-api';
import Controller from '@core/Controller';
import { FilePath, QuoteGenreList } from '@helpers/enums';
import ResponseMessage from '@helpers/response-message';

export default class QuoteController extends Controller {
  async quote(): Promise<Response> {
    return this.successResponse(Object.values(QuoteGenreList));
  }

  async quoteGenre(): Promise<Response> {
    const { req } = this;
    const { genre } = req.params;

    if (Object.values<string>(QuoteGenreList).includes(genre as string)) {
      if (genre === QuoteGenreList.Random) {
        const path = FilePath.Quotes;
        const result = await fsPromise.readFile(path, 'utf8');
        const quoteJson = JSON.parse(result);
        const random = Math.floor(Math.random() * quoteJson.length);

        const resultTranslate = await translate(quoteJson[random].text, {
          to: 'id',
        });

        return this.successResponse({
          text_en: quoteJson[random].text,
          text_id: resultTranslate.text,
          author: quoteJson[random].author,
        });
      }

      if (genre === QuoteGenreList.Kanye) {
        const url = 'https://api.kanye.rest/';
        const { data } = await axios.get(url);
        const resultTranslate = await translate(data.quote, {
          to: 'id',
        });

        return this.successResponse({
          text_en: data.quote,
          text_id: resultTranslate.text,
          author: 'Kanye West',
        });
      }

      if (genre === QuoteGenreList.Agamis) {
        const path = FilePath.QuotesAgamis;
        const result = await fsPromise.readFile(path, 'utf8');
        const json = JSON.parse(result);
        const random = Math.floor(Math.random() * json.length);

        return this.successResponse({ text_id: json[random] });
      }
    }

    return this.errorResponse('Genre not found', 404);
  }

  async quoteMaker(): Promise<Response> {
    const { req } = this;
    const { author, quote } = req.query;
    if (!author && !quote) {
      return this.errorResponse(
        ResponseMessage.queryRequired(
          ['author', 'quote'],
          ['sae kadal', 'wayahe wayahe'],
        ),
      );
    }

    const url = `https://terhambar.com/aw/qts/?kata=${quote}&author=${author}&tipe=random`;
    const { data } = await axios.get(url);
    return this.successResponse(data);
  }
}
