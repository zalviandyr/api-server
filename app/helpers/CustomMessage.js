class CustomMessage {
    constructor(res) {
        this.response = res
    }

    success(message, statusCode = 200, callback = null) {
        if (callback !== null) callback()
        const { response } = this
        response.status(statusCode).json(message)
    }

    successStream(streamData, statusCode = 200, fileName) {
        const { response } = this
        response.header('Content-Disposition', `attachment; filename=${fileName}`)
        response.status(statusCode)
        streamData.pipe(response)
    }

    error(message, statusCode = 400, callback = null) {
        if (callback !== null) callback()
        const { response } = this
        response.status(statusCode).json(message)
    }
}

module.exports = { CustomMessage }
