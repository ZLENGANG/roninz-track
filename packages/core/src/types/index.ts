interface Error {
  core?: boolean; // 是否采集异常数据
  server?: boolean; // 是否采集报错接口数据
}

interface Event {
  core?: boolean; // 是否采集点击事件
}

interface Performance {
  core?: boolean; // 是否采集静态资源、接口的相关数据
  firstResource?: boolean; // 是否采集首次进入页面的数据
  server?: boolean; // 是否采集接口请求
}

interface Pv {
  core?: boolean; // 是否发送页面跳转相关数据
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

  // 上报数据最大缓存数
  cacheMaxLength: number;

  // 上报数据最大等待时间
  cacheWatingTime: number;

  // 是否强制指定发送形式为xml，body请求方式
  sendTypeByXmlBody: boolean;

  // 当某个时间段报错时，会将此类错误转为特殊错误类型，会新增错误持续时间范围
  scopeError: boolean;

  /**是否开启点击事件 */
  event: Event;

  performance: Performance;

  pv: Pv;

  // 添加到行为列表前的 hook (在这里面可以给出错误类型，然后就能达到用户想拿到是何种事件类型的触发)
  beforePushEventList: AnyFun[];

  // 数据上报前的 hook
  beforeSendData: AnyFun[];

  // 数据上报后的 hook
  afterSendData: AnyFun[];
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

  // 上报数据最大缓存数
  cacheMaxLength?: number;

  // 上报数据最大等待时间
  cacheWatingTime?: number;

  // 是否强制指定发送形式为xml，body请求方式
  sendTypeByXmlBody?: boolean;

  // 当某个时间段报错时，会将此类错误转为特殊错误类型，会新增错误持续时间范围
  scopeError?: boolean;

  /**是否开启点击事件 */
  event?: Event | boolean;

  performance?: Performance | boolean;

  pv?: Pv | boolean;

  // 添加到行为列表前的 hook (在这里面可以给出错误类型，然后就能达到用户想拿到是何种事件类型的触发)
  beforePushEventList?: AnyFun;

  // 数据上报前的 hook
  beforeSendData?: (data: any) => any;

  // 数据上报后的 hook
  afterSendData?: (data: any) => void;
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

export type VoidFun = {
  (...args: any[]): void;
};
