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
const audio = require("./audio");
const remaps = require("./remaps");

const state = {
    els: [],
    lines: [
        //linify({speed: 500, x1: 150, y1: 150, x2: 750, y2: 450, cooldown: 0.1})
    ],
    colls: [],
    genName: "sidewalk",
    genOpts: {},
    lineInProgress: null,
    lastTickTime: 0,
    drawMod: "normal"
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

function tickLine(line, now, deltaTime) {
    var checkColl = true;
    if (isNaN(line.position)) {
        checkColl = false;
        line.position = 0;
    }
    if (line.speed > 1) {
        line.position += line.speed / 1000000.0 * deltaTime;
        while (line.position >= 1) {
            line.position -= 1;
            checkColl = false;
        }
    }
    const oldCx = line.cx;
    const oldCy = line.cy;
    var pos = line.position;
    switch(line.behavior) {
        case "rev":
            pos = 1.0 - pos;
            break;
        case "bounce":
            pos = (pos >= 0.5 ? 1.0 - (pos - 0.5) * 2 : pos * 2);
            break;
    }
    pos = remaps.nonlin(pos, line.nonlin);
    line.cx = lerp(line.x1, line.x2, pos);
    line.cy = lerp(line.y1, line.y2, pos);
    if (checkColl && oldCx && oldCy && line.cx && line.cy) {
        var coll = null;
        for (var i = 0; i < state.els.length; i++) {
            coll = elcoll(state.els[i], oldCx, oldCy, line.cx, line.cy);
            if (coll) break;
        }
        if (coll) {
            const secSincePlay = (now - line.lastPlay) / 1000.0;
            var play = false;
            if (secSincePlay >= line.cooldown) {
                const pitch = remaps.z(pos, line.positionToPitch, 1.0);
                audio.play(line.sound, pitch);
                line.lastPlay = now;
                play = true;
            }
            state.colls.push({
                x: line.cx,
                y: line.cy,
                life: 100,
                play
            });

        }
    }
}

function tick() {
    if(!state.lines.length) return;
    const now = +new Date();
    var deltaTime = (now - state.lastTickTime);
    state.lastTickTime = now;
    if(deltaTime > 100) return;  // Oops?
    state.lines.forEach((line) => {
        tickLine(line, now, deltaTime);

    });
    state.colls = state.colls.filter((coll) => {
        coll.life--;
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
    setInterval(tick, 1);
}


window.addEventListener("load", init, false);
