const decodeBase64 = require("../util/decode-base64");

function audioBufferFromDataURI(context, dataUri, done) {
    // shenanigans ahoy: we want to decode into a uint8 view of a dynamically sized buffer,
    // so the modified decodeBase64 accepts a second arg that lets us pass a ctor which
    // returns said uint8 view
    var arrayBuffer = null;
    const byteArray = decodeBase64(
        dataUri.split(",")[1],
        function (n) {
            arrayBuffer = new ArrayBuffer(n);
            return new Uint8Array(arrayBuffer);
        }
    );
    context.decodeAudioData(arrayBuffer, (data) => {
        done(data);
    });
}


function Sample(context, dataUri) {
    const self = this;
    this.buffer = null;
    this.context = context;
    audioBufferFromDataURI(context, dataUri, (data) => {
        self.buffer = data;
    })
}

Sample.prototype.play = function (pitch = 1) {
    if (pitch <= 0) return;
    const {context, buffer} = this;
    if (buffer === null) return;
    const node = context.createBufferSource();
    node.buffer = buffer;
    node.connect(context.destination);
    node.onended = function () {
        node.disconnect();
    };
    node.playbackRate.value = pitch;
    node.start();
};

export default Sample;
