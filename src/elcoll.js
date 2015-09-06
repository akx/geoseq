function inBbox(x, y, x1, y1, x2, y2) {
    return( x1 <= x && x <= x2 && y1 <= y && y <= y2 );
    
}

export default function(el, x1, y1, x2, y2) {
    if(el.type == "rect") {
        const halfWidth = el.width / 2;
        const halfHeight = el.height / 2;
        const rx1 = el.x - halfWidth;
        const ry1 = el.y - halfHeight;
        const rx2 = el.x + halfWidth;
        const ry2 = el.y + halfHeight;
        var in1 = inBbox(x1, y1, rx1, ry1, rx2, ry2);
        var in2 = inBbox(x2, y2, rx1, ry1, rx2, ry2);
        return !!(in1 ^ in2);
    }
};
