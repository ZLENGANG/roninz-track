import { EVENTTYPES, SEDNEVENTTYPES, SENDID } from '../common/constant';
import { RecordEventScope } from '../types';
import { filter, getLocationHref, getTimestamp, map } from '../utils';
import { _global } from '../utils/global';
import { isArray } from '../utils/is';
import { batchError, initBatchError } from './error-batch';
import { eventBus } from './eventBus';
import { options } from './options';
import { getEventList, zip } from './recordscreen';
import { sendData } from './sendData';

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
  const { stack = '', message = '' } = err;
  const result = { eventId: SENDID.CODE, errMessage: message, errStack: stack };

  if (stack) {
    const rChromeCallStack = /^\s*at\s*([^(]+)\s*\((.+?):(\d+):(\d+)\)$/;
    const rMozlliaCallStack = /^\s*([^@]*)@(.+?):(\d+):(\d+)$/;
    // chrome中包含了message信息,将其去除,并去除后面的换行符
    const callStackStr = stack.replace(
      new RegExp(`^[\\w\\s:]*${message}\n`),
      ''
    );

    const callStackFrameList = map(
      filter(callStackStr.split('\n'), (item: string) => item),
      (str: string) => {
        const chromeErrResult = str.match(rChromeCallStack);
        if (chromeErrResult) {
          return {
            triggerPageUrl: chromeErrResult[2],
            line: chromeErrResult[3], // 错误发生位置的行数
            col: chromeErrResult[4], // 错误发生位置的列数
          };
        }

        const mozlliaErrResult = str.match(rMozlliaCallStack);
        if (mozlliaErrResult) {
          return {
            triggerPageUrl: mozlliaErrResult[2],
            line: mozlliaErrResult[3],
            col: mozlliaErrResult[4],
          };
        }
        return {};
      }
    );
    const item = callStackFrameList[0] || {};

    return { ...result, ...item };
  }
  return result;
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

    if (fileName) {
      return {
        errMessage: message,
        errStack: stack,
        eventId: SENDID.CODE,
        line: lineNumber, // 不稳定属性 - 在某些浏览器可能是undefined，被废弃了
        col: columnNumber, // 不稳定属性 - 非标准，有些浏览器可能不支持
        triggerPageUrl: fileName, // 不稳定属性 - 非标准，有些浏览器可能不支持
      };
    }

    return parseStack(e);
  }

  // reject 错误
  if (typeof e === 'string') {
    return {
      eventId: SENDID.REJECT,
      errMessage: e,
    };
  }

  // console.error 暴露的错误
  if (isArray(e))
    return { eventId: SENDID.CONSOLEERROR, errMessage: e.join(';') };

  return {};
}

/**
 * 判断是否为 promise-reject 错误类型
 */
function isPromiseRejectedResult(
  event: ErrorEvent | PromiseRejectedResult
): event is PromiseRejectedResult {
  return (event as PromiseRejectedResult).reason !== undefined;
}

/**
 * 解析错误事件，根据不同的错误类型返回不同的错误信息。
 * @param event 可以是 ErrorEvent 或 PromiseRejectedResult 类型。
 * @returns 返回一个对象，包含错误的详细信息。
 */
function parseErrorEvent(event: ErrorEvent | PromiseRejectedResult) {
  // promise reject错误
  if (isPromiseRejectedResult(event)) {
    return { eventId: SENDID.CODE, ...parseError(event.reason) };
  }

  // html元素上发生的异常错误
  const { target } = event;
  if (target instanceof HTMLElement) {
    if (target.nodeType === 1) {
      const result = {
        initiatorType: target.nodeName.toLowerCase(),
        eventId: SENDID.RESOURCE,
        requestUrl: '',
      };
      switch (target.nodeName.toLowerCase()) {
        case 'link':
          result.requestUrl = (target as HTMLLinkElement).href;
          break;
        default:
          result.requestUrl =
            (target as HTMLImageElement).currentSrc ||
            (target as HTMLScriptElement).src;
      }
      return result;
    }
  }

  //   代码错误
  if (event.error) {
    const e = event.error;
    e.fileName = e.filename || event.filename;
    e.columnNumber = e.colno || event.colno;
    e.lineNumber = e.lineno || event.lineno;
    return { eventId: SENDID.CODE, ...parseError(e) };
  }

  // 兜底
  // ie9版本,从全局的event对象中获取错误信息
  return {
    eventId: SENDID.CODE,
    line: (_global as any).event.errorLine,
    col: (_global as any).event.errorCharacter,
    errMessage: (_global as any).event.errorMessage,
    triggerPageUrl: (_global as any).event.errorUrl,
  };
}

function getRecordEvent(): RecordEventScope[] {
  const _recordscreenList: RecordEventScope[] = JSON.parse(
    JSON.stringify(getEventList())
  );

  return _recordscreenList
    .slice(-2)
    .map((item) => item.eventList)
    .flat();
}

/**
 * 发送错误事件信息
 * @param errorInfo 信息源
 */
function emit(errorInfo: any, flush = false) {
  const info = {
    ...errorInfo,
    eventType: SEDNEVENTTYPES.ERROR,
    recordscreen: options.recordScreen ? zip(getRecordEvent()) : null,
    triggerPageUrl: getLocationHref(),
    triggerTime: getTimestamp(),
  };

  options.scopeError
    ? batchError.pushCacheErrorA(info)
    : sendData.emit(info, flush);
}

export function initError() {
  //@ts-ignore
  if (!options.error?.core) return;

  if (options.scopeError) {
    initBatchError();

    // 如果开启了检测批量错误 则要挂载卸载事件以防缓存池内的错误丢失
    eventBus.addEvent({
      type: EVENTTYPES.BEFOREUNLOAD,
      callback: () => {
        batchError.sendAllCacheError();
      },
    });
  }

  eventBus.addEvent({
    type: EVENTTYPES.ERROR,
    callback: (e: ErrorEvent) => {
      const errorInfo = parseErrorEvent(e);
      emit(errorInfo);
    },
  });

  eventBus.addEvent({
    type: EVENTTYPES.UNHANDLEDREJECTION,
    callback: (e: PromiseRejectedResult) => {
      const errorInfo = parseErrorEvent(e);
      emit(errorInfo);
    },
  });

  eventBus.addEvent({
    type: EVENTTYPES.CONSOLEERROR,
    callback: (e: any) => {
      const errorInfo = parseError(e);
      emit(errorInfo);
    },
  });
}
