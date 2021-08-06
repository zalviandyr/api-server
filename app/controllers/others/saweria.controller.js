const SaweriaClient = require('saweria');
const { CustomMessage } = require('helpers/CustomMessage');
const { authentication } = require('helpers/values');

class SaweriaController {
    constructor(req, res) {
        this.request = req;
        this.response = res;
    }

    async controller() {
        const { response } = this;

        try {
            const client = new SaweriaClient();
            await client.login(authentication.saweria.email, authentication.saweria.password);
            const transactions = await client.getTransaction();
            const user = await client.getUser();

            const result = {
                username: user.username,
                link: 'https://saweria.co/' + user.username,
                description: user.description,
                profile_picture: user.profilePicture,
                social: {
                    facebook: user.socials.facebook,
                    instagram: user.socials.instagram,
                    twitch: user.socials.twitch,
                    twitter: user.socials.twitter,
                    youtube: user.socials.youtube,
                },
                transactions,
            };

            return new CustomMessage(response).success(result);
        } catch (err) {
            return new CustomMessage(response).error({
                status_code: 500,
                message: err.message,
            }, 500);
        }
    }
}

module.exports = { SaweriaController };
