const Sample = require("./sample");

window.AudioContext = window.AudioContext || window.webkitAudioContext;
const context = new AudioContext();
export var samples = {
    "click": new Sample(context, require("!url!./tick.wav")),
    "marimba": new Sample(context, require("!url!./micromarimba.wav")),
    "piano": new Sample(context, require("!url!./piano.wav")),
    "808kick": new Sample(context, require("!url!./808kick.wav")),
    "909snare": new Sample(context, require("!url!./909snare.wav")),
    "909chh": new Sample(context, require("!url!./909chh.wav")),
};

export function play(soundName, pitch = 1) {
    if (pitch <= 0) return;
    const sound = samples[soundName];
    if(sound) sound.play(pitch);
}
