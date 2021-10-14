import { Response } from 'express';
import { Writable } from 'stream';
import axios from 'axios';
import translate from 'google-translate-api';
import Controller from '@core/Controller';
import ResponseMessage from '@helpers/response-message';
import { SpeechLangList } from '@helpers/enums';
import { authentication } from '@helpers/values';
import { toMp3 } from '@helpers/utilities';

export default class TranslationController extends Controller {
  async translate(): Promise<Response> {
    const { req } = this;
    const { text } = req.query;
    if (!text) {
      return this.errorResponse(
        ResponseMessage.queryRequired(['text'], ['こんにちは']),
      );
    }

    const result = await translate(text as string, { to: 'id' });
    return this.successResponse({
      text: result.text,
      typo: result.from.text.value,
      from: result.from.language.iso,
      to: 'id',
    });
  }

  async speech(): Promise<Response> {
    return this.successResponse(Object.values(SpeechLangList));
  }

  async speechLang(): Promise<Writable> {
    const { req } = this;
    const { lang } = req.params;
    const { text } = req.query;

    if (!text) {
      return this.errorResponse(
        ResponseMessage.queryRequired(['text'], ['hello world']),
      );
    }

    if (Object.values<string>(SpeechLangList).includes(lang as string)) {
      let voiceModel = '';
      if (lang === 'en') voiceModel = 'en-US_EmilyV3Voice';
      if (lang === 'kr') voiceModel = 'ko-KR_YunaVoice';
      if (lang === 'jp') voiceModel = 'ja-JP_EmiV3Voice';
      if (lang === 'es') voiceModel = 'es-ES_LauraV3Voice';
      if (lang === 'fr') voiceModel = 'fr-FR_ReneeV3Voice';
      if (lang === 'br') voiceModel = 'pt-BR_IsabelaV3Voice';
      if (lang === 'cn') voiceModel = 'zh-CN_ZhangJingVoice';
      if (lang === 'nl') voiceModel = 'nl-NL_EmmaVoice';
      if (lang === 'ar') voiceModel = 'ar-AR_OmarVoice';
      if (lang === 'it') voiceModel = 'it-IT_FrancescaV3Voice';
      if (lang === 'de') voiceModel = 'de-DE_ErikaV3Voice';

      const url = `https://api.us-south.text-to-speech.watson.cloud.ibm.com/instances/ce3d3b7b-679f-436f-9b2a-1873729665e0/v1/synthesize?voice=${voiceModel}`;
      const result = await axios({
        url,
        method: 'post',
        headers: {
          Authorization:
            'Basic ' +
            Buffer.from(
              authentication.ibm.username + ':' + authentication.ibm.password,
            ).toString('base64'),
          Accept: 'audio/wav',
          'Content-Type': 'application/json',
        },
        data: { text },
        responseType: 'stream',
      });

      const resultMp3 = await toMp3(result.data);
      return this.successStreamResponse(resultMp3, 'audio.mp3');
    }

    return this.errorResponse('Language not found', 404);
  }
}
