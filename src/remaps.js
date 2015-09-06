export function z(val, param, center) {
    param = Math.max(-1, param);
    return center + val * param;
}

export function nonlin(val, param) {
    const EPSILON = 0.00001;
    if(Math.abs(param) < EPSILON) return val;
    param = (param + 1) / 2;
    param = Math.max(EPSILON, Math.min(1 - EPSILON, param));
    if (param < 0.5) {
        param = 2.0 * (param);
        return Math.pow(val, param);
    } else {
        param = 2.0 * (param - 0.5);
        return Math.pow(val, 1.0 / (1 - param));
    }
}
