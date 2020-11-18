const url = require('url')

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

const getVideoID = (link) => {
    const idRegex = /^[a-zA-Z0-9-_]{11}$/;
    const validQueryDomains = new Set([
        'youtube.com',
        'www.youtube.com',
        'm.youtube.com',
        'music.youtube.com',
        'gaming.youtube.com',
    ]);
    const validPathDomains = /^https?:\/\/(youtu\.be\/|(www\.)?youtube.com\/(embed|v)\/)/;

    const parsed = url.parse(link, true);
    let id = parsed.query.v;
    if (validPathDomains.test(link) && !id) {
        const paths = parsed.pathname.split('/');
        id = paths[paths.length - 1];
    } else if (parsed.hostname && !validQueryDomains.has(parsed.hostname)) {
        throw Error('Not a YouTube domain');
    }
    if (!id) {
        throw Error(`No video id found: ${link}`);
    }
    id = id.substring(0, 11);
    if (!idRegex.test(id)) {
        throw TypeError(`Video id (${id}) does not match expected format (${idRegex.toString()})`);
    }

    return id;
}
exports.getVideoID = getVideoID
