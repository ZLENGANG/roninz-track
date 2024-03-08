import { EVENTTYPES } from "../common/constant";
import { isValidKey, on, replaceAop, throttle } from "../utils";
import { _global } from "../utils/global";
import { eventBus } from "./eventBus";

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
 * 监听 - click
 */
function listenClick(type: EVENTTYPES): void {
  if (!("document" in _global)) return;
  const clickThrottle = throttle(eventBus.runEvent, 100, true);
  on(
    _global.document,
    "click",
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
    "beforeunload",
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
    "error",
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
  on(_global, "unhandledrejection", function (ev: PromiseRejectionEvent) {
    // ev.preventDefault() 阻止默认行为后，控制台就不会再报红色错误
    eventBus.runEvent(type, ev);
  });
}

/**
 * 重写 - console.error
 */
function replaceConsoleError(type: EVENTTYPES) {
  replaceAop(console, "error", (originalError) => {
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
    "online",
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
    "offline",
    function (e: Event) {
      eventBus.runEvent(type, e);
    },
    true
  );
}
