const _ = require("lodash");
const decodeBase64 = require("./util/decode-base64");

window.AudioContext = window.AudioContext || window.webkitAudioContext;
const context = new AudioContext();
var clickBuffer = null;

function loadClick() {
    const clickDataUri = require("!url!./tick.wav");
    // shenanigans ahoy: we want to decode into a uint8 view of a dynamically sized buffer,
    // so the modified decodeBase64 accepts a second arg that lets us pass a ctor which
    // returns said uint8 view
    var clickArrayBuffer = null;
    const clickByteArray = decodeBase64(
        clickDataUri.split(",")[1],
        function (n) {
            clickArrayBuffer = new ArrayBuffer(n);
            return new Uint8Array(clickArrayBuffer);
        }
    );
    context.decodeAudioData(clickArrayBuffer, (data) => {clickBuffer = data;});
}


export function play(pitch=1) {
    if(pitch <= 0) return;
    if(clickBuffer === null) return;
    const node = context.createBufferSource();
    node.buffer = clickBuffer;
    node.connect(context.destination);
    node.onended = function() {
        node.disconnect();
    };
    node.playbackRate.value = pitch;
    node.start();
}

loadClick();
