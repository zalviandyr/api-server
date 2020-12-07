const axios = require('axios')
const { CustomMessage } = require('helpers/CustomMessage')

class BosanController {
    constructor(req, res) {
        this.request = req
        this.response = res
    }

    async controller() {
        const { response } = this
        try {
            const url = 'https://www.boredapi.com/api/activity'

            const result = await axios.get(url)
            const resultResponse = {
                activity: result.data.activity,
                type: result.data.type,
            }

            return new CustomMessage(response).success(resultResponse)
        } catch (err) {
            return new CustomMessage(response).error({
                status_code: 500,
                message: err.message,
            }, 500)
        }
    }
}

module.exports = { BosanController }
