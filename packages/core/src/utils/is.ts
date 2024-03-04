function isType(type: any) {
  return function (value: any): boolean {
    return Object.prototype.toString.call(value) === `[object ${type}]`;
  };
}

export const isWindow = isType('Window');
export const isFunction = isType('Function');
export const isArray = isType('Array')
