import { Response } from 'express';
import axios from 'axios';
import { transform } from 'camaro';
import Controller from '@core/Controller';
import ResponseMessage from '@helpers/response-message';

export default class ReligionController extends Controller {
  async alkitab(): Promise<Response> {
    const { req } = this;
    const { name, chapter, number } = req.query;
    if (!name && !chapter && !number) {
      return this.errorResponse(
        ResponseMessage.queryRequired(
          ['name', 'chapter', 'number'],
          ['yohanes', '1', '1-5'],
        ),
      );
    }

    const url = `https://alkitab.sabda.org/api/passage.php?passage=${(
      name as string
    ).toLowerCase()}+${chapter}:${number}`;

    const { data } = await axios.get(url);
    const template = [
      '/bible/book',
      {
        name: '@name',
        title: 'title',
        chapter: 'chapter/chap',
        description: [
          'chapter/verses/verse',
          {
            number: 'number',
            text: 'text',
          },
        ],
      },
    ];

    const resultResponse = await transform(data, template);
    return this.successResponse(resultResponse);
  }
}
