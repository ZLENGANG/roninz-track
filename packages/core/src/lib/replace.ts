import { EVENTTYPES } from '../common/constant';
import { VoidFun } from '../types';
import { getTimestamp, isValidKey, on, replaceAop, throttle } from '../utils';
import { _global } from '../utils/global';
import { eventBus } from './eventBus';

export function initReplace() {
  for (const key in EVENTTYPES) {
    replace(key as EVENTTYPES);
  }
}

function replace(type: EVENTTYPES) {
  if (!isValidKey(type, EVENTTYPES)) return;
  const value = EVENTTYPES[type];
  switch (value) {
    case EVENTTYPES.ERROR:
      listenError(EVENTTYPES.ERROR);
      break;

    case EVENTTYPES.UNHANDLEDREJECTION:
      listenUnhandledRejection(EVENTTYPES.UNHANDLEDREJECTION);
      break;

    case EVENTTYPES.CONSOLEERROR:
      replaceConsoleError(EVENTTYPES.CONSOLEERROR);
      break;

    case EVENTTYPES.CLICK:
      listenClick(EVENTTYPES.CLICK);
      break;

    case EVENTTYPES.BEFOREUNLOAD:
      listenBeforeunload(EVENTTYPES.BEFOREUNLOAD);
      break;

    case EVENTTYPES.XHROPEN:
      replaceXHROpen(EVENTTYPES.XHROPEN);
      break;

    case EVENTTYPES.XHRSEND:
      replaceXHRSend(EVENTTYPES.XHRSEND);
      break;

    case EVENTTYPES.FETCH:
      replaceFetch(EVENTTYPES.FETCH);
      break;

    case EVENTTYPES.LOAD:
      listenLoad(EVENTTYPES.LOAD);
      break;

    case EVENTTYPES.OFFLINE:
      listenOffline(EVENTTYPES.OFFLINE);
      break;

    case EVENTTYPES.ONLINE:
      listenOnline(EVENTTYPES.ONLINE);
      break;

    default:
      break;
  }
}

/**
 * 监听 - load
 */
function listenLoad(type: EVENTTYPES): void {
  on(
    _global,
    'load',
    function (e: Event) {
      eventBus.runEvent(type, e);
    },
    true
  );
}

/**
 * 重写 - fetch
 */
function replaceFetch(type: EVENTTYPES): void {
  if (!('fetch' in _global)) return;
  replaceAop(_global, 'fetch', (originalFetch) => {
    return function (this: any, ...args: any[]): void {
      const fetchStart = getTimestamp();
      return originalFetch.apply(_global, args).then((res: any) => {
        eventBus.runEvent(type, ...args, res, fetchStart);
        return res;
      });
    };
  });
}

/**
 * 重写 - XHR-send
 */
function replaceXHRSend(type: EVENTTYPES): void {
  if (!('XMLHttpRequest' in _global)) return;
  replaceAop(XMLHttpRequest.prototype, 'send', (originalSend: VoidFun) => {
    return function (this: any, ...args: any[]): void {
      eventBus.runEvent(type, this, ...args);
      originalSend.apply(this, args);
    };
  });
}

/**
 * 重写 - XHR-open
 */
function replaceXHROpen(type: EVENTTYPES): void {
  if (!('XMLHttpRequest' in _global)) return;
  replaceAop(XMLHttpRequest.prototype, 'open', (originalOpen: VoidFun) => {
    return function (this: any, ...args: any[]): void {
      eventBus.runEvent(type, ...args);
      originalOpen.apply(this, args);
    };
  });
}

/**
 * 监听 - click
 */
function listenClick(type: EVENTTYPES): void {
  if (!('document' in _global)) return;
  const clickThrottle = throttle(eventBus.runEvent, 100, true);
  on(
    _global.document,
    'click',
    function (this: any, e: MouseEvent) {
      // clickThrottle.call(eventBus, type, e)
      eventBus.runEvent(type, e);
    },
    true
  );
}

/**
 * 监听 - beforeunload
 */
function listenBeforeunload(type: EVENTTYPES) {
  on(
    _global,
    'beforeunload',
    function (e: BeforeUnloadEvent) {
      eventBus.runEvent(type, e);
    },
    false
  );
}

/**
 * 监听 - error
 */
function listenError(type: EVENTTYPES) {
  on(
    _global,
    'error',
    function (e: ErrorEvent) {
      eventBus.runEvent(type, e);
    },
    true
  );
}

/**
 * 监听 - unhandledrejection（promise异常）
 */
function listenUnhandledRejection(type: EVENTTYPES): void {
  on(_global, 'unhandledrejection', function (ev: PromiseRejectionEvent) {
    // ev.preventDefault() 阻止默认行为后，控制台就不会再报红色错误
    eventBus.runEvent(type, ev);
  });
}

/**
 * 重写 - console.error
 */
function replaceConsoleError(type: EVENTTYPES) {
  replaceAop(console, 'error', (originalError) => {
    return function (this: any, ...args: any[]) {
      eventBus.runEvent(type, args);
      originalError.apply(this, args);
    };
  });
}

/**
 * 监听 - online 网络是否开启
 */
function listenOnline(type: EVENTTYPES): void {
  on(
    _global,
    'online',
    function (e: Event) {
      eventBus.runEvent(type, e);
    },
    true
  );
}

/**
 * 监听 - offline 网络是否关闭
 */
function listenOffline(type: EVENTTYPES): void {
  on(
    _global,
    'offline',
    function (e: Event) {
      eventBus.runEvent(type, e);
    },
    true
  );
}
