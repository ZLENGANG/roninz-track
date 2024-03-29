import { isWindow } from './is';

/**
 * 是否为浏览器环境
 */
export const isBrowserEnv = isWindow(
  typeof window !== 'undefined' ? window : 0
);

/**
 * 是否为 electron 环境
 */
export const isElectronEnv = !!window?.process?.versions?.electron;

/**
 * 获取全局变量
 */
export function getGlobal(): Window {
  if (isBrowserEnv || isElectronEnv) return window;
  return {} as Window;
}


/**
 * 判断sdk是否初始化
 * @returns sdk是否初始化
 */
export function isInit(): boolean {
  return !!_global.__roninzTrackInit__
}

const _global = getGlobal();

export { _global };
