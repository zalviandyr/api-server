const axios = require('axios');
const { CustomMessage } = require('helpers/CustomMessage');
const { authentication } = require('helpers/values');
const { toMp3 } = require('helpers/utilities');

class SpeechController {
    constructor(req, res) {
        this.request = req;
        this.response = res;
    }

    async controller() {
        const { request, response } = this;
        const { lang, text } = request.query;

        if (!lang && !text) {
            return new CustomMessage(response).error({
                status_code: 400,
                message: 'Silahkan input query lang dan text, contoh ?lang=en&text=hai',
            }, 400);
        }

        const langList = [
            'en', 'kr', 'jp', 'es',
            'fr', 'br', 'cn', 'nl',
            'ar', 'it', 'de'];

        try {
            if (langList.includes(lang)) {
                const voice = (() => {
                    let temp;
                    if (lang === 'en') temp = 'en-US_EmilyV3Voice';
                    if (lang === 'kr') temp = 'ko-KR_YunaVoice';
                    if (lang === 'jp') temp = 'ja-JP_EmiV3Voice';
                    if (lang === 'es') temp = 'es-ES_LauraV3Voice';
                    if (lang === 'fr') temp = 'fr-FR_ReneeV3Voice';
                    if (lang === 'br') temp = 'pt-BR_IsabelaV3Voice';
                    if (lang === 'cn') temp = 'zh-CN_ZhangJingVoice';
                    if (lang === 'nl') temp = 'nl-NL_EmmaVoice';
                    if (lang === 'ar') temp = 'ar-AR_OmarVoice';
                    if (lang === 'it') temp = 'it-IT_FrancescaV3Voice';
                    if (lang === 'de') temp = 'de-DE_ErikaV3Voice';
                    return temp;
                })();
                const url = `https://api.us-south.text-to-speech.watson.cloud.ibm.com/instances/ce3d3b7b-679f-436f-9b2a-1873729665e0/v1/synthesize?voice=${voice}`;

                const result = await axios({
                    url,
                    method: 'post',
                    headers: {
                        Authorization: 'Basic ' + Buffer.from(authentication.ibm.username + ':' + authentication.ibm.password).toString('base64'),
                        Accept: 'audio/wav',
                        'Content-Type': 'application/json',
                    },
                    data: { text },
                    responseType: 'stream',
                });

                const resultMp3 = await toMp3(result.data);
                return new CustomMessage(response).successStream(resultMp3, 200, 'audio.mp3');
            }

            return new CustomMessage(response).error({
                status_code: 404,
                message: 'Lang not found',
            }, 404);
        } catch (err) {
            return new CustomMessage(response).error({
                status_code: 500,
                message: err.message,
            }, 500);
        }
    }
}

module.exports = { SpeechController };
