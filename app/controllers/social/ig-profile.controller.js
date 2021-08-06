const axios = require('axios');
const { CustomMessage } = require('helpers/CustomMessage');
const { authentication } = require('helpers/values');

class IgProfileController {
    constructor(req, res) {
        this.request = req;
        this.response = res;
    }

    async controller() {
        const { request, response } = this;
        const { username } = request.query;

        if (!username) {
            return new CustomMessage(response).error({
                status_code: 400,
                message: 'Silahkan input query username, contoh: ?username=zukronalviandy11',
            }, 400);
        }

        try {
            const url = `https://igblade.com/api/v2/accounts/${username}`;
            const result = await axios.get(url, {
                headers: { Authorization: `Bearer ${authentication.igBlade.bearer}` },
                responseType: 'json',
            });

            const profile = result.data.profile;
            const resultResponse = {
                username: profile.username,
                name: profile.name,
                biography: profile.biography,
                profile_picture: profile.profile_picture,
                is_private: profile.is_private,
                is_verified: profile.is_verified,
                follower: profile.follower_count,
                following: profile.following_count,
                external_url: profile.external_url,
                posts: profile.media_count,
            };

            return new CustomMessage(response).success(resultResponse);
        } catch (err) {
            return new CustomMessage(response).error({
                status_code: 500,
                message: err.message,
            }, 500);
        }
    }
}

module.exports = { IgProfileController };
