const _ = require("lodash");
const m = require("mithril");

export default function(attr, optsHash, regen=_.noop) {
    const value = (optsHash[attr.id] !== undefined ? optsHash[attr.id] : attr.value);
    const change = function() { optsHash[attr.id] = this.valueAsNumber; regen(); };
    const reset = function() { delete optsHash[attr.id]; regen(); };
    const maybeReset = function(e) { if(e.ctrlKey) reset(); };
    const randomize = function() { optsHash[attr.id] = _.random(attr.min, attr.max, true); regen(); };
    const zero = function() { optsHash[attr.id] = 0; regen(); };
    return m("div", [
        m("div", [
            m("span", attr.id + " : " + value.toFixed(2)),
            m("a", {href: "#", onclick: randomize}, "random"),
            m("a", {href: "#", onclick: reset}, "reset"),
            m("a", {href: "#", onclick: zero}, "zero"),
        ]),
        m("input", {
            type: "range",
            min: attr.min,
            max: attr.max,
            step: attr.step,
            value: value,
            title: "" + value,
            oninput: change,
            onchange: change,
            ondblclick: reset,
            onclick: maybeReset,
        })
    ]);
}
