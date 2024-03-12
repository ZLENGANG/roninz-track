import { EVENTTYPES, SEDNEVENTTYPES, SENDID } from "../common/constant";
import { AnyObj } from "../types";
import {
  getLocationHref,
  getTimestamp,
  isValidKey,
  normalizeObj,
  on,
  sendReaconImageList,
} from "../utils";
import { _global } from "../utils/global";
import { eventBus } from "./eventBus";
import { options } from "./options";
import { sendData } from "./sendData";

const supported = {
  performance: !!_global.performance,
  getEntriesByType: !!(
    _global.performance && _global.performance.getEntriesByType
  ),
  PerformanceNavigationTiming: "PerformanceNavigationTiming" in _global,
  PerformanceObserver: "PerformanceObserver" in _global,
  MutationObserver: "MutationObserver" in _global,
};

// 资源属性
const performanceEntryAttrs = {
  initiatorType: "",
  transferSize: 0,
  encodedBodySize: 0,
  decodedBodySize: 0,
  duration: 0,
  redirectStart: 0,
  redirectEnd: 0,
  startTime: 0,
  fetchStart: 0,
  domainLookupStart: 0,
  domainLookupEnd: 0,
  connectStart: 0,
  connectEnd: 0,
  requestStart: 0,
  responseStart: 0,
  responseEnd: 0,
  workerStart: 0,
};

/**
 * 发送页面性能数据
 */
function observeNavigationTiming() {
  const times: AnyObj = {};
  const { performance } = _global;
  let t: any = performance.timing;
  times.fmp = 0;
  if (supported.getEntriesByType) {
    const paintEntries = performance.getEntriesByType("paint");
    if (paintEntries.length) {
      times.fmp = paintEntries[paintEntries.length - 1].startTime;
    }
  }
  if (supported.PerformanceNavigationTiming) {
    const nt2Timing = performance.getEntriesByType("navigation")[0];
    if (nt2Timing) t = nt2Timing;
  }

  // 从开始发起这个页面的访问开始算起,减去重定向跳转的时间,在performanceV2版本下才进行计算
  // v1版本的fetchStart是时间戳而不是相对于访问起始点的相对时间
  // fmp：首次有效绘制，标记主角元素渲染完成的时间点，主角元素可以是视频网站的视频控件，内容网站的页面框架也可以是资源网站的头图等
  if (times.fmp && supported.PerformanceNavigationTiming) {
    times.fmp -= t.fetchStart;
  }

  // 白屏时间 (从请求开始到浏览器开始解析第一批HTML文档字节的时间差)
  times.fpt = t.responseEnd - t.fetchStart;

  // 首次可交互时间，从页面开始加载，一直到用户可以自由输入或操作页面的时间
  times.tti = t.domInteractive - t.fetchStart;

  // HTML加载完成时间
  times.ready = t.domContentLoadedEventEnd - t.fetchStart;

  // 页面完全加载时间
  times.loadon = t.loadEventStart - t.fetchStart;

  // 首包时间
  times.firstbyte = t.responseStart - t.domainLookupStart;

  // dns查询耗时
  times.dns = t.domainLookupEnd - t.domainLookupStart;

  // dns缓存时间
  times.appcache = t.domainLookupStart - t.fetchStart;

  // tcp连接耗时
  times.tcp = t.connectEnd - t.connectStart;

  // 请求响应耗时
  times.ttfb = t.responseStart - t.requestStart;

  // 内容传输耗时
  times.trans = t.responseEnd - t.responseStart;

  // dom解析耗时
  times.dom = t.domInteractive - t.responseEnd;

  // 同步资源加载耗时
  times.res = t.loadEventStart - t.domContentLoadedEventEnd;

  // SSL安全连接耗时
  times.ssllink = t.connectEnd - t.secureConnectionStart;

  // 重定向时间
  times.redirect = t.redirectEnd - t.redirectStart;

  // 上一个页面的卸载耗时
  times.uploadTime = t.unloadEventEnd - t.unloadEventStart;

  const resultInfo = {
    ...times,
    triggerPageUrl: getLocationHref(),
  };

  sendData.emit(
    normalizeObj({
      ...resultInfo,
      eventType: SEDNEVENTTYPES.PERFORMANCE,
      eventId: SENDID.PAGE,
    })
  );
}

/**
 * 发送页面追踪资源加载性能数据
 * (支持getEntriesByType的情况下才追踪)
 */
function traceResourcePerformance(performance: PerformanceObserverEntryList) {
  // 排除xmlhttprequest类型,服务器有响应便会记录,包括404的请求,转由http-request模块负责记录请求数据,区分请求状态
  // 同时也会排除一些其他类型,比如在引入一个script后会触发一次性能监控,它的类型是beacon,这一次的要排除
  const observerTypeList = ["img", "script", "link", "audio", "video", "css"];

  const entries = performance.getEntriesByType(
    "resource"
  ) as PerformanceResourceTiming[];

  const records: any[] = [];

  entries.forEach((entry) => {
    const { initiatorType = "" } = entry;
    if (observerTypeList.indexOf(initiatorType.toLowerCase()) < 0) return;

    if (sendReaconImageList.length) {
      const index = sendReaconImageList.findIndex(
        (item) => item.src === entry.name
      );

      if (index > -1) {
        sendReaconImageList.splice(index, -1);
        return;
      }
    }

    const value: AnyObj = {};
    Object.keys(performanceEntryAttrs).forEach((attr) => {
      if (isValidKey(attr, entry)) {
        value[attr] = entry[attr];
      }
    });

    records.push(
      normalizeObj({
        ...value,
        eventType: SEDNEVENTTYPES.PERFORMANCE,
        eventId: SENDID.RESOURCE,
        requestUrl: entry.name,
        triggerTime: getTimestamp(),
        triggerPageUrl: getLocationHref(),
      })
    );
  });

  if (records.length) sendData.emit(records);
  return records;
}

/**
 * 监听 - 异步插入的script、link、img, DOM更新操作记录
 */
function observeSourceInsert() {
  const tags = ["img", "script", "link"];
  const observer = new MutationObserver((list) => {
    for (let i = 0; i < list.length; i++) {
      const startTime = getTimestamp();
      const { addedNodes = [] } = list[i];
      addedNodes.forEach((node: Node & { src?: string; href?: string }) => {
        const { nodeName } = node;
        if (tags.indexOf(nodeName.toLowerCase()) !== -1) {
          on(node as Document, EVENTTYPES.LOAD, function () {
            sendData.emit(
              normalizeObj({
                eventType: SEDNEVENTTYPES.PERFORMANCE,
                eventId: SENDID.RESOURCE,
                requestUrl: node.src || node.href,
                duration: getTimestamp() - startTime,
                triggerTime: getTimestamp(),
                triggerPageUrl: getLocationHref(),
              })
            );
          });
          on(node as Document, EVENTTYPES.ERROR, function () {
            sendData.emit(
              normalizeObj({
                eventType: SEDNEVENTTYPES.PERFORMANCE,
                eventId: SENDID.RESOURCE,
                requestUrl: node.src || node.href,
                responseStatus: "error",
                duration: getTimestamp() - startTime,
                triggerTime: getTimestamp(),
                triggerPageUrl: getLocationHref(),
              })
            );
          });
        }
      });
    }
  });

  observer.observe(_global.document, {
    subtree: true, // 目标以及目标的后代改变都会观察
    childList: true, // 表示观察目标子节点的变化，比如添加或者删除目标子节点，不包括修改子节点以及子节点后代的变化
    // attributes: true, // 观察属性变动
    // attributeFilter: ['src', 'href'] // 要观察的属性
  });
}

/**
 * 页面资源加载性能数据
 */
function observeResource() {
  if (supported.performance && options.performance.firstResource) {
    observeNavigationTiming();
  }

  if (supported.performance && options.performance.core) {
    traceResourcePerformance(_global.performance);
    if (supported.PerformanceObserver) {
      const observer = new PerformanceObserver(traceResourcePerformance);
      observer.observe({ entryTypes: ["resource"] });
    } else if (supported.MutationObserver) {
      // if (supported.MutationObserver) {
      // 监听资源、DOM更新操作记录 chrome≥26 ie≥11
      observeSourceInsert();
    }
  }
}

export function initPerformance() {
  if (!options.performance.core && !options.performance.firstResource) return;

  eventBus.addEvent({
    type: EVENTTYPES.LOAD,
    callback: () => {
      observeResource();
    },
  });
}
