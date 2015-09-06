require("!style!css!./geoseq.css");
const m = require("mithril");
const elify = require("./elify");
const linify = require("./linify");
const _ = require("lodash");
const lerp = require("./lerp");
const gens = require("./gens");
const ctrlUi = require("./ui/ctrl");
const sceneUi = require("./ui/scene");
const lineUi = require("./ui/line");
const elcoll = require("./elcoll");

const state = {
    els: [],
    lines: [
        linify({x1: 150, y1: 150, x2: 750, y2: 450})
    ],
    colls: [],
    genName: "sidewalk",
    genOpts: {},
    lineInProgress: null
};


function regen() {
    const els = state.els = [];
    var cb = (params) => els.push(elify(params));
    var gen = gens[state.genName];
    gen(state.genOpts, cb);
    state._elsAsM = null;
}


function scene() {
    return sceneUi(state);
}

function ctrl() {
    return m("div", [
        ctrlUi(state, regen),
        lineUi(state, regen),
    ]);
}

function tick() {
    state.lines.forEach((line) => {
        var checkColl = true;
        if(isNaN(line.position)) {
            checkColl = false;
            line.position = 0;
        }
        if(line.speed > 1) {
            line.position += 1 / line.speed;
            while (line.position >= 1) {
                line.position -= 1;
                checkColl = false;
            }
        }
        const oldCx = line.cx;
        const oldCy = line.cy;
        const pos = Math.pow(line.position, 1 + line.nonlin);
        line.cx = lerp(line.x1, line.x2, pos);
        line.cy = lerp(line.y1, line.y2, pos);
        if(checkColl && oldCx && oldCy && line.cx && line.cy) {
            var coll = null;
            for(var i = 0; i < state.els.length; i++) {
                coll = elcoll(state.els[i], oldCx, oldCy, line.cx, line.cy);
                if(coll) break;
            }
            if(coll) {
                state.colls.push({
                    x: line.cx,
                    y: line.cy,
                    life: 100
                });
            }
        }
    });
    state.colls = state.colls.filter((coll) => {
        coll.life --;
        return (coll.life > 0);
    });
    m.redraw();
}

function init() {
    var sceneWrap = _.assign(document.createElement("div"), {"id": "scene"});
    document.body.appendChild(sceneWrap);
    var ctrlWrap = _.assign(document.createElement("div"), {"id": "ctrl"});
    document.body.appendChild(ctrlWrap);
    m.mount(sceneWrap, {view: scene, controller: _.noop});
    m.mount(ctrlWrap, {view: ctrl, controller: _.noop});
    regen();
    m.redraw();
    setInterval(tick, 1 / 30);
}


window.addEventListener("load", init, false);