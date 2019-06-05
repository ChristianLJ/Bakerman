/**
 *
 * @param {string} utf8str
 * @returns number
 */
module.exports = function prettySize(utf8str) {
    const bytes = Buffer.byteLength(utf8str, "utf8");
    const kilobytes = bytes / 1024;
    const megabytes = kilobytes / 1024;
    return bytes > 1024
        ? kilobytes > 1024
            ? `${megabytes.toFixed(2)} MB`
            : `${kilobytes.toFixed(2)} KB`
        : `${bytes} bytes`;
};
