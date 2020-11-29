const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const size = ['Bytes', 'KB', 'MB', 'GB', 'TB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))
    const temp = parseFloat((bytes / k ** i).toFixed(dm))

    return temp + ' ' + size[i]
}
exports.formatBytes = formatBytes

const toCamelCase = (str) => str
    .replace(/\s(.)/g, ($1) => $1.toUpperCase())
    .replace(/\s/g, '')
    .replace(/^(.)/, ($1) => $1.toLowerCase())

exports.toCamelCase = toCamelCase

const errorResponse = (statusCode, message) => ({ status_code: statusCode, message })
exports.errorResponse = errorResponse
