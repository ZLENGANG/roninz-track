function isType(type: any) {
  return function (value: any): boolean {
    return Object.prototype.toString.call(value) === `[object ${type}]`;
  };
}

export const isWindow = isType("Window");
export const isFunction = isType("Function");
export const isArray = isType("Array");
export const isRegExp = isType("RegExp");
export const isString = isType("String");
export const isBoolean = isType("Boolean");
export const isNumber = isType("Number");
export const isFlase = (val: any) => {
  return isBoolean(val) && String(val) === "false";
};

/**
 * 判断值是否为空 ['', undefined, null]
 */
export function isEmpty(wat: any): boolean {
  return (
    (isString(wat) && wat.trim() === "") || wat === undefined || wat === null
  );
}

/**
 * 控制台输出错误信息
 * @param args 错误信息
 */
export function logError(...args: any[]): void {
  console.error("@roninz-track: ", ...args);
}
