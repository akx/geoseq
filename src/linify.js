const _ = require("lodash");
const lineAttrs = require("./line-attrs");

var DEFAULTS = {
    position: 0,
    lastPlay: 0
};

lineAttrs.forEach((attr) => {
    DEFAULTS[attr.id] = attr.value;
});

export default function(params) {
    _.defaults(params, {key: "" + Math.random()}, DEFAULTS);
    return params;
};
