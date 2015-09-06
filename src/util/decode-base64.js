// based on https://github.com/beatgammit/base64-js/blob/master/lib/b64.js
const lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const PLUS = '+'.charCodeAt(0);
const SLASH = '/'.charCodeAt(0);
const NUMBER = '0'.charCodeAt(0);
const LOWER = 'a'.charCodeAt(0);
const UPPER = 'A'.charCodeAt(0);
const PLUS_URL_SAFE = '-'.charCodeAt(0);
const SLASH_URL_SAFE = '_'.charCodeAt(0);
const Arr = (typeof Uint8Array !== 'undefined') ? Uint8Array : Array;

function decode(elt) {
    const code = elt.charCodeAt(0);
    if (code === PLUS || code === PLUS_URL_SAFE) return 62; // '+'
    if (code === SLASH || code === SLASH_URL_SAFE) return 63; // '/'
    if (code < NUMBER) return -1; // no match
    if (code < NUMBER + 10) return code - NUMBER + 26 + 26;
    if (code < UPPER + 26) return code - UPPER;
    if (code < LOWER + 26) return code - LOWER + 26;
}

export default function (b64, ctor=Arr) {
    var i, j, l, tmp;

    if (b64.length % 4 > 0) {
        throw new Error('Invalid string. Length must be a multiple of 4')
    }

    // the number of equal signs (place holders)
    // if there are two placeholders, than the two characters before it
    // represent one byte
    // if there is only one, then the three characters before it represent 2 bytes
    // this is just a cheap hack to not do indexOf twice
    const len = b64.length;
    const placeHolders = b64.charAt(len - 2) === '=' ? 2 : b64.charAt(len - 1) === '=' ? 1 : 0;
    const arr = ctor(b64.length * 3 / 4 - placeHolders);

    // if there are placeholders, only get up to the last complete 4 chars
    l = placeHolders > 0 ? b64.length - 4 : b64.length

    var L = 0;

    function push(v) {
        arr[L++] = v
    }

    for (i = 0, j = 0; i < l; i += 4, j += 3) {
        tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3));
        push((tmp & 0xFF0000) >> 16);
        push((tmp & 0xFF00) >> 8);
        push(tmp & 0xFF);
    }

    if (placeHolders === 2) {
        tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4);
        push(tmp & 0xFF);
    } else if (placeHolders === 1) {
        tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2);
        push((tmp >> 8) & 0xFF);
        push(tmp & 0xFF);
    }

    return arr;
}
