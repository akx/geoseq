var _ = require("lodash");

var DEFAULTS = {
    position: 0,
    speed: 150,
    nonlin: 0
};

export default function(params) {
    _.defaults(params, {key: "" + Math.random()}, DEFAULTS);
    return params;
};
