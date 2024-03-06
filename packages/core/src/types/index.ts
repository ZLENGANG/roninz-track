interface Error {
  core?: boolean; // 是否采集异常数据
  server?: boolean; // 是否采集报错接口数据
}

export type InternalOptions = {
  /**上报地址 */
  dsn: string;

  /**应用地址 */
  appName: string;

  /**应用code */
  appCode: string;

  /**应用版本 */
  appVersion: string;

  /**用户Id */
  userUuid: string;

  /**是否debug模式 */
  debug: boolean;

  error: Error;

  /**额外参数 */
  ext: AnyObj;

  // 是否开启录屏
  recordScreen: boolean;

  tracesSampleRate: number; // 抽样发送

  // 添加到行为列表前的 hook (在这里面可以给出错误类型，然后就能达到用户想拿到是何种事件类型的触发)
  beforePushEventList: AnyFun[];
};

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

  error?: Error | boolean;

  // 是否开启录屏
  recordScreen?: boolean;

  tracesSampleRate?: number; // 抽样发送

  // 添加到行为列表前的 hook (在这里面可以给出错误类型，然后就能达到用户想拿到是何种事件类型的触发)
  beforePushEventList?: AnyFun;
};

export type AnyObj<T = any> = {
  [key: string]: T;
};

export type AnyFun = {
  (...args: any[]): any;
};

export interface RecordEventScope {
  scope: string;
  eventList: any[];
}
