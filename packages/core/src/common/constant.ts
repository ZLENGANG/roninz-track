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
