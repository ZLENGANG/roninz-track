import { EVENTTYPES, SENDID } from '../common/constant';
import { eventBus } from './eventBus';
import { options } from './options';

type InstabilityNature = {
  lineNumber: string;
  fileName: string;
  columnNumber: string;
};

/**
 * 格式化错误对象信息
 * @param err Error 错误对象
 */
function parseStack(err: Error) {
  console.dir(err);
}

/**
 * 分析错误信息
 * @param e 错误源信息
 * @returns 相对标准格式的错误信息
 */
function parseError(e: any) {
  if (e instanceof Error) {
    const { message, stack, lineNumber, fileName, columnNumber } = e as Error &
      InstabilityNature;

    // if (fileName) {
    //   return {
    //     errMessage: message,
    //     errStack: stack,
    //     eventId: SENDID.CODE,
    //     line: lineNumber, // 不稳定属性 - 在某些浏览器可能是undefined，被废弃了
    //     col: columnNumber, // 不稳定属性 - 非标准，有些浏览器可能不支持
    //     triggerPageUrl: fileName, // 不稳定属性 - 非标准，有些浏览器可能不支持
    //   };
    // }

    return parseStack(e);
  }
  if (typeof e === 'string') {
    return {
      eventId: SENDID.REJECT,
      errMessage: e,
    };
  }
}

/**
 * 判断是否为 promise-reject 错误类型
 */
function isPromiseRejectedResult(
  event: ErrorEvent | PromiseRejectedResult
): event is PromiseRejectedResult {
  return (event as PromiseRejectedResult).reason !== undefined;
}

function parseErrorEvent(event: ErrorEvent | PromiseRejectedResult) {
  // promise reject错误
  if (isPromiseRejectedResult(event)) {
    return { eventId: SENDID.CODE, ...parseError(event.reason) };
  }

  //   代码错误
  if (event.error) {
    const e = event.error;
    e.fileName = e.filename || event.filename;
    e.columnNumber = e.colno || event.colno;
    e.lineNumber = e.lineno || event.lineno;
    return { eventId: SENDID.CODE, ...parseError(e) };
  }
}
export function initError() {
  //@ts-ignore
  if (!options.error?.core) return;

  eventBus.addEvent({
    type: EVENTTYPES.ERROR,
    callback: (e: ErrorEvent) => {
      const errorInfo = parseErrorEvent(e);
      //   console.log(errorInfo);
    },
  });

  eventBus.addEvent({
    type: EVENTTYPES.UNHANDLEDREJECTION,
    callback: (e: PromiseRejectionEvent) => {
      const errorInfo = parseErrorEvent(e);
    },
  });

  eventBus.addEvent({
    type: EVENTTYPES.CONSOLEERROR,
    callback: (e: any) => {
      console.log(e, 'console111');
    },
  });
}
