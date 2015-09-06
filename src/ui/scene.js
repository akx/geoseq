const _ = require("lodash");
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

function collUi(state) {
    return state.colls.map((coll, i) => {
        return m("circle.coll" + (coll.play ? ".play" : ""), {
            cx: coll.x,
            cy: coll.y,
            r: 15 * (coll.life / 100),
            key: "coll" + i,
        });
    });
}

function handleDraw(state, event) {
    var {x: x2, y: y2} = event;
    const thisLine = state.lineInProgress;
    const lastLine = _.last(state.lines);
    var {x1, y1} = thisLine;
    const dy = y2 - y1;
    const dx = x2 - x1;
    const dst = Math.sqrt(dx * dx + dy * dy);
    if (event.shiftKey) {
        const quadSizeRad = Math.PI / 8;
        const angRad = Math.atan2(dy, dx);
        const angQtzRad = Math.floor(angRad / quadSizeRad) * quadSizeRad;
        x2 = thisLine.x1 + Math.cos(angQtzRad) * dst;
        y2 = y1 + Math.sin(angQtzRad) * dst;
    }
    switch(state.drawMod) {
        case "collinear":
        case "perpendicular":
            if(lastLine) {
                const lastDx = lastLine.x2 - lastLine.x1;
                const lastDy = lastLine.y2 - lastLine.y1;
                var ang = Math.atan2(lastDy, lastDx);
                if(state.drawMod == "perpendicular") {
                    ang += (dx < 0 ? -1 : +1) * Math.PI / 2;
                }
                x2 = thisLine.x1 + Math.cos(ang) * dst;
                y2 = y1 + Math.sin(ang) * dst;
            }
            break;
        case "repositionLast":
            if(lastLine) {
                const lastDx = lastLine.x2 - lastLine.x1;
                const lastDy = lastLine.y2 - lastLine.y1;
                thisLine.x1 = x2;
                thisLine.y1 = y2;
                x2 += lastDx;
                y2 += lastDy;
            }
            break;

    }
    thisLine.x2 = x2;
    thisLine.y2 = y2;
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
                handleDraw(state, e);
            },
            "onmouseup": (e) => {
                if (state.lineInProgress !== null) {
                    state.lines.push(linify(state.lineInProgress));
                    state.lineInProgress = null;
                }
            }
        },
        elsAsM,
        lineUi(state),
        collUi(state)
    );
};
