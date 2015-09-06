
export function num(id, value=0, {min=0, max=0, step=0.1}={}) {
    max = Math.max(max, value);
    min = Math.min(min, value);
    return {id, value, min, max, step};
};
