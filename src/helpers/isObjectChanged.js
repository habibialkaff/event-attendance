function isNullOrUndefined(obj) {
  return obj === undefined || obj === null;
}

function diffPropValue(curr, next) {
  return Object.keys(curr).some((key) => {
    return curr[key] !== next[key];
  });
}

export function isObjectChanged(curr, next) {
  return next !== curr ||
    (!isNullOrUndefined(next) && (isNullOrUndefined(curr) || diffPropValue(curr, next)));
}
