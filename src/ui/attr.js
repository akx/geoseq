const _ = require("lodash");
const m = require("mithril");
const action = require("./action");

function numAttr(attr, value, optsHash, regen) {
    const change = function() { optsHash[attr.id] = this.valueAsNumber; regen(); };
    return m("input", {
        type: "range",
        min: attr.min,
        max: attr.max,
        step: attr.step,
        value: value,
        title: "" + value,
        oninput: change,
        onchange: change,
    });
}

function selAttr(attr, value, optsHash, regen) {
    const change = function() { optsHash[attr.id] = this.value; regen(); };
    return m("select", {
        value: value,
        oninput: change,
        onchange: change
    }, attr.choices.map((choice) => m("option", {value: choice}, choice)));
}

export default function(attr, optsHash, regen=_.noop, optsHashesArray=null) {
    const value = (optsHash[attr.id] !== undefined ? optsHash[attr.id] : attr.value);
    const reset = function() { delete optsHash[attr.id]; regen(); };
    const copyToAll = function() { (optsHashesArray || []).forEach((hash) => { hash[attr.id] = value; }); };
    var randomize = null;
    var zero = null;
    var comp = null;
    var valueLabel = null;
    switch(attr.type) {
        case "num":
            randomize = () => { optsHash[attr.id] = _.random(attr.min, attr.max, true); regen(); };
            comp = numAttr(attr, value, optsHash, regen);
            zero = () => { optsHash[attr.id] = 0; regen(); };
            valueLabel = value.toFixed(2);
            break;
        case "sel":
            randomize = () => { optsHash[attr.id] = _.sample(attr.choices); regen(); };
            comp = selAttr(attr, value, optsHash, regen);
            break;
    }
    return m("div", [
        m("div", [
            m("span", attr.id + (valueLabel ? " : " + valueLabel : "")),
            randomize && action("random", randomize),
            action("reset", reset),
            zero && action("zero", zero),
            optsHashesArray && action("to all", copyToAll),
        ]),
        comp
    ]);
}
