var _ = require("lodash");

export function gen(attrs, fn) {
    const defaults = {};
    attrs.forEach((attr) => {
        defaults[attr.id] = attr.value || 0;
    });
    var out = function(opts, cb) {
        return fn(_.defaults(opts, defaults), cb);
    };
    out.attrs = attrs;
    out.defaults = defaults;
    return out;
};

export var {num} = require("../attr");
