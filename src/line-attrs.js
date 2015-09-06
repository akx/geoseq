const attr = require("./attr");
const sampleNames = Object.keys(require("./audio").samples).sort();

export default [
    attr.sel("behavior", "fwd", ["fwd", "rev", "bounce"]),
    attr.sel("sound", "click", sampleNames),
    attr.num("speed", 150, {min: 0, max: 2000, step: 1}),
    attr.num("nonlin", 0, {min: 0, max: 1, step: 0.05}),
    attr.num("cooldown", 0.1, {min: 0, max: 1, step: 0.01}),
    attr.num("positionToPitch", 0, {min: -100, max: +1000, step: 1}),
];
