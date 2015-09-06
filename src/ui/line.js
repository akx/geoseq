const gens = require("../gens");
const m = require("mithril");
const attrui = require("./attr");
const lineAttrs = require("../line-attrs");
const action = require("./action");

function singleLineUi(line, state) {
    return m("div.line-ui", {key: line.key}, [
        m("div",
            action("delete", () => {
                state.lines = _.reject(state.lines, line);
            })
        ),
        m("div", lineAttrs.map((attr) => attrui(attr, line)))
    ]);
}

export default function lineUi(state) {
    return m("div.lines-ui",
        m("div.lines-actions", [
            action("sync", () => {
                state.lines.forEach((line) => {
                    line.position = 0;
                });
            })
        ]),
        state.lines.map((line) => singleLineUi(line, state))
    );
}
