var {gen, num} = require("./make");
export default gen([
  num("nx", 20, {max: 100}),
  num("ny", 20, {max: 100}),
  num("width", 40, {max: 100}),
  num("height", 40, {max: 100}),
  num("nTiles", 3, {min: 2, max: +50, step: 1}),
  num("padding", 0, {min: 0, max: 99, step: 1}),
  num("margin", 0, {min: 0, max: 50, step: 1}),
  num("spacing", 0, {min: 0, max: 100, step: 1}),
], function(opts, cb) {
  const p = 1.0 - (opts.padding / 100);
  const m = 1.0 - (opts.margin / 100);
  const s = 1.0 + (opts.spacing / 100);
  for (var iy = 0; iy < opts.ny; iy++) {
    for (var ix = 0; ix < opts.nx; ix++) {
      var horz = ((ix + iy) % 2 == 0);
      var key = "" + ix + "," + iy;
      for (var i = 0; i < opts.nTiles; i++) {
        var a = i / opts.nTiles;
        var x = ix * opts.width * s;
        var y = iy * opts.height * s;
        var width = opts.width;
        var height = opts.height;
        if (horz) {
          x += a * opts.width;
          width /= opts.nTiles;
        } else {
          y += a * opts.height;
          height /= opts.nTiles;
        }
        // Reanchor to top-left before scaling:
        x += width / 2;
        y += height / 2;
        if (horz) {
          width *= p;
          height *= m;
        } else {
          height *= p;
          width *= m;
        }
        cb({x, y, width, height, key: key + "," + i});
      }
    }
  }
});
