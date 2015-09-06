var _ = require("lodash");

var DEFAULTS = {
    type: "rect",
    cx: 0,
    cy: 0,
    width: 10,
    height: 10,
    rotation: 0
};

export default function(params) {
    _.defaults(params, DEFAULTS);
    return params;
};
