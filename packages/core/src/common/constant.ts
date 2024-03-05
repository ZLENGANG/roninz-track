/**
 * 事件类型
 */
export enum EVENTTYPES {
  ERROR = 'error',
  CONSOLEERROR = 'consoleError',
  UNHANDLEDREJECTION = 'unhandledrejection',
  CLICK = 'click',
  LOAD = 'load',
  BEFOREUNLOAD = 'beforeunload',
  FETCH = 'fetch',
  XHROPEN = 'xhr-open',
  XHRSEND = 'xhr-send',
  HASHCHANGE = 'hashchange',
  HISTORYPUSHSTATE = 'history-pushState',
  HISTORYREPLACESTATE = 'history-replaceState',
  POPSTATE = 'popstate',
  READYSTATECHANGE = 'readystatechange',
  ONLINE = 'online',
  OFFLINE = 'offline',
}

/**
 * 触发的事件id - eventID
 */
export enum SENDID {
  PAGE = 'page', // 页面
  RESOURCE = 'resource', // 资源
  SERVER = 'server', // 请求
  CODE = 'code', // code
  REJECT = 'reject', // reject
  CONSOLEERROR = 'console.error', // console.error
}


/**
 * 触发的事件是什么类型 - eventType
 */
export enum SEDNEVENTTYPES {
  PV = 'pv', // 路由跳转
  PVDURATION = 'pv-duration', // 页面停留事件
  ERROR = 'error', // 错误
  PERFORMANCE = 'performance', // 资源
  CLICK = 'click', // 点击
  DWELL = 'dwell', // 页面卸载
  CUSTOM = 'custom', // 手动触发事件
  INTERSECTION = 'intersection' // 曝光采集
}