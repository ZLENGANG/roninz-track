export type InitOptions = {
  /**上报地址 */
  dsn: string;

  /**应用地址 */
  appName: string;

  /**应用code */
  appCode?: string;

  /**应用版本 */
  appVersion?: string;

  /**用户Id */
  userUuid?: string;

  /**额外参数 */
  ext?: AnyObj;

  /**是否debug模式 */
  debug?: boolean;
};

export type AnyObj<T = any> = {
  [key: string]: T;
};

export type AnyFun = {
  (...args: any[]): any;
};
