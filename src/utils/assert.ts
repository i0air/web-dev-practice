export const isNumber = (val: unknown): val is number => typeof val === "number";
export const isFunction = (val: unknown): val is Function => typeof val === "function";
export const isArray = <T = unknown>(val: unknown): val is Array<T> => Array.isArray(val);
export const isObject = (val: unknown): val is Object => val !== null && typeof val === "object";
