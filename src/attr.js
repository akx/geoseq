
export function num(id, value=0, {min=0, max=0, step=0.1}={}) {
    max = Math.max(max, value);
    min = Math.min(min, value);
    return {type: "num", id, value, min, max, step};
};

export function sel(id, value="", choices=[]) {
    return {type: "sel", id, value, choices};
}
