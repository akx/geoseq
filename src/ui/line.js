const gens = require("../gens");
const m = require("mithril");
const attrui = require("./attr");
const attr = require("../attr");

const attrs = [
    attr.num("speed", 0, {min: 0, max: 2000, step: 1}),
    attr.num("nonlin", 0, {min: 0, max: 1, step: 0.05})
];

function singleLineUi(line, state) {
    return m("div", [
        m("div", attrs.map((attr) => attrui(attr, line)))
    ]);
}

export default function lineUi(state) {
    return m("div.line-ui", state.lines.map((line) => singleLineUi(line, state)));
}
