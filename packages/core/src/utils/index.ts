/**
 * 补全字符
 * @param {*} num 初始值
 * @param {*} len 需要补全的位数
 * @param {*} placeholder 补全的值
 * @returns 补全后的值
 */
export function pad(num: number, len: number, placeholder = "0") {
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
 * 获取当前的时间戳
 * @returns 当前的时间戳
 */
export function getTimestamp(): number {
  return Date.now();
}