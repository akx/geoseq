const gens = require("../gens");
const m = require("mithril");
const attrui = require("./attr");

export default function ctrlUi(state, regen) {
    var gen = gens[state.genName];
    const genSelectDiv = m("div", [
        m("select",
            {value: state.genName, onclick: function(e) { state.genName = this.value; }},
            Object.keys(gens).map((genName) => m("option", {value: genName}, genName)))
    ]);

    const genAttrDiv = m("div", gen.attrs.map((attr) => attrui(attr, state.genOpts, regen)));
    return m("div.ctrl-ui", [genSelectDiv, genAttrDiv]);
}
