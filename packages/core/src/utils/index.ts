import { AnyFun, AnyObj } from '../types';
import { isFunction } from './is';

/**
 * 添加事件监听器
 * @param target 对象
 * @param eventName 事件名称
 * @param handler 回调函数
 * @param opitons
 */
export function on(
  target: Window | Document,
  eventName: string,
  handler: AnyFun,
  opitons = false
): void {
  target.addEventListener(eventName, handler, opitons);
}

/**
 * 重写对象上面的某个属性
 * @param source 需要被重写的对象
 * @param name 需要被重写对象的key
 * @param replacement 以原有的函数作为参数，执行并重写原有函数
 * @param isForced 是否强制重写（可能原先没有该属性）
 */
export function replaceAop(
  source: AnyObj,
  name: string,
  replacement: AnyFun,
  isForced = false
) {
  if (!source) return;
  if (name in source || isForced) {
    const original = source[name];
    const wrapped = replacement(original);
    if (isFunction(wrapped)) {
      source[name] = wrapped;
    }
  }
}

/**
 * 补全字符
 * @param {*} num 初始值
 * @param {*} len 需要补全的位数
 * @param {*} placeholder 补全的值
 * @returns 补全后的值
 */
export function pad(num: number, len: number, placeholder = '0') {
  const str = String(num);
  if (str.length < len) {
    let result = str;
    for (let i = 0; i < len - str.length; i += 1) {
      result = placeholder + result;
    }
    return result;
  }
  return str;
}

/**
 * 获取一个随机字符串
 */
export function uuid() {
  const date = new Date();

  // yyyy-MM-dd的16进制表示,7位数字
  const hexDate = parseInt(
    `${date.getFullYear()}${pad(date.getMonth() + 1, 2)}${pad(
      date.getDate(),
      2
    )}`,
    10
  ).toString(16);

  // hh-mm-ss-ms的16进制表示，最大也是7位
  const hexTime = parseInt(
    `${pad(date.getHours(), 2)}${pad(date.getMinutes(), 2)}${pad(
      date.getSeconds(),
      2
    )}${pad(date.getMilliseconds(), 3)}`,
    10
  ).toString(16);

  // 第8位数字表示后面的time字符串的长度
  let guid = hexDate + hexTime.length + hexTime;

  // 补充随机数，补足32位的16进制数
  while (guid.length < 32) {
    guid += Math.floor(Math.random() * 16).toString(16);
  }

  // 分为三段，前两段包含时间戳信息
  return `${guid.slice(0, 8)}-${guid.slice(8, 16)}-${guid.slice(16)}`;
}

/**
 * 获取cookie中目标name的值
 * @param name cookie名
 * @returns
 */
export function getCookieByName(name: string) {
  const result = document.cookie.match(new RegExp(`${name}=([^;]+)(;|$)`));
  return result ? result[1] : undefined;
}

/**
 * 获取当前页面的url
 * @returns 当前页面的url
 */
export function getLocationHref(): string {
  if (typeof document === 'undefined' || document.location == null) return '';
  return document.location.href;
}

/**
 * 获取当前的时间戳
 * @returns 当前的时间戳
 */
export function getTimestamp(): number {
  return Date.now();
}

/**
 * 判断对象中是否包含该属性
 * @param key 键
 * @param object 对象
 * @returns 是否包含
 */
export function isValidKey(
  key: string | number | symbol,
  object: object
): key is keyof typeof object {
  return key in object;
}

const arrayMap =
  Array.prototype.map ||
  function polyfillMap(this: any, fn) {
    const result = [];
    for (let i = 0; i < this.length; i += 1) {
      result.push(fn(this[i], i, this));
    }
    return result;
  };

/**
 * map方法
 * @param arr 源数组
 * @param fn 条件函数
 * @returns
 */
export function map(arr: any[], fn: AnyFun) {
  return arrayMap.call(arr, fn);
}

const arrayFilter =
  Array.prototype.filter ||
  function filterPolyfill(this: any, fn: AnyFun) {
    const result = [];
    for (let i = 0; i < this.length; i += 1) {
      if (fn(this[i], i, this)) {
        result.push(this[i]);
      }
    }
    return result;
  };

/**
 * filter方法
 * @param arr 源数组
 * @param fn 条件函数
 */
export function filter(arr: any[], fn: AnyFun) {
  return arrayFilter.call(arr, fn);
}

/**
 * 随机概率通过
 * @param randow 设定比例，例如 0.7 代表 70%的概率通过
 * @returns 是否通过
 */
export function randomBoolean(randow: number) {
  return Math.random() <= randow;
}

/**
 * 批量执行方法
 * @param funList 方法数组
 * @param through 是否将第一次参数贯穿全部方法
 * @param args 额外参数
 * @returns
 */
export function executeFunctions(
  funList: AnyFun[],
  through: boolean,
  args: any
): any {
  if (funList && funList.length === 0) return args;

  let result: any = undefined;
  for (let i = 0; i < funList.length; i++) {
    const func = funList[i];
    if (i === 0 || through) {
      result = func(args);
    } else {
      result = func(result);
    }
  }
  return result;
}
