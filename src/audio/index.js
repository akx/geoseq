const Sample = require("./sample");

window.AudioContext = window.AudioContext || window.webkitAudioContext;
const context = new AudioContext();
export var samples = {
    "click": new Sample(context, require("!url!./tick.wav"))
};

export function play(soundName, pitch = 1) {
    if (pitch <= 0) return;
    const sound = samples[soundName];
    if(sound) sound.play(pitch);
}
