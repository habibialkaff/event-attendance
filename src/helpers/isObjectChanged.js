import {isNullOrUndefined} from './isNullOrUndefined';

function diffPropValue(curr, next) {
  return Object.keys(curr).some((key) => {
    return curr[key] !== next[key];
  });
}

export function isObjectChanged(curr, next) {
  return !isNullOrUndefined(next) &&
    (isNullOrUndefined(curr) || diffPropValue(curr, next));
}


