const m = require("mithril");
const linify = require("../linify");

function elAsM(el) {
    var attrs, tag;
    if (el.type == "rect") {
        attrs = {
            x: el.x - el.width / 2,
            y: el.y - el.height / 2,
            width: el.width,
            height: el.height
        };
        tag = "rect";
    }
    if (tag && attrs) {
        attrs.key = el.key;
        return m(tag, attrs);
    }
};

function lineUi(state) {
    const {lines, lineInProgress} = state;
    return [
        lines.map((line) => {
            return m("line.wline", {
                key: "line-" + line.key,
                x1: line.x1, y1: line.y1,
                x2: line.x2, y2: line.y2,
            });
        }),
        lines.map((line) => {
            if(line.cx === undefined || line.cy === undefined) return;
            return m("circle.pos", {
                cx: line.cx,
                cy: line.cy,
                r: 10,
                key: "cl" + line.key,
            });
        }),
        (lineInProgress !== null ? m("line.xline", {
            key: "xline",
            x1: lineInProgress.x1, y1: lineInProgress.y1,
            x2: lineInProgress.x2, y2: lineInProgress.y2,
        }) : null)
    ];
}


export default function (state) {
    if(!state._elsAsM) {
        state._elsAsM = state.els.map(elAsM);
    }
    const elsAsM = state._elsAsM;
    return m(
        "svg",
        {
            "width": window.innerWidth,
            "height": window.innerHeight,
            "onmousedown": (e) => {
                state.lineInProgress = {
                    x1: e.x, y1: e.y,
                    x2: e.x, y2: e.y,
                };
            },
            "onmousemove": (e) => {
                if (state.lineInProgress === null) return;
                state.lineInProgress.x2 = e.x;
                state.lineInProgress.y2 = e.y;
            },
            "onmouseup": (e) => {
                if (state.lineInProgress !== null) {
                    state.lines.push(linify(state.lineInProgress));
                    state.lineInProgress = null;
                }
            }
        },
        elsAsM,
        lineUi(state)
    );
};
