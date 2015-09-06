var {gen, num} = require("./make");
export default gen([
    num("nx", 20, {max: 100}),
    num("ny", 20, {max: 100}),
    num("width", 40, {max: 100}),
    num("height", 40, {max: 100}),
    num("spacing", 5, {min: -50, max: +50, step: 1}),
    num("staggerX", 0.5, {min: -5, max: 5, step: 0.05}),
    num("staggerY", 0, {min: -5, max: 5, step: 0.05}),
    num("nonlinX", 0, {min: -1, max: 1, step: 0.05}),
    num("nonlinY", 0, {min: -1, max: 1, step: 0.05}),
], function(opts, cb) {
    for (var iy = 0; iy < opts.ny; iy++) {
        for (var ix = 0; ix < opts.nx; ix++) {
            var x = (ix + (iy % 2 == 0 ? opts.staggerX : 0));
            var y = (iy + (ix % 2 == 0 ? opts.staggerY : 0))
            x *= Math.pow(ix / opts.nx, opts.nonlinX);
            x *= (opts.width + opts.spacing);
            y *= Math.pow(iy / opts.ny, opts.nonlinY);
            y *= (opts.height + opts.spacing);
            cb({x, y, width: opts.width, height: opts.height, key: "" + ix + "," + iy});
        }
    }
});
