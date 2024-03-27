import { InitOptions } from "./src/types";
import { initBase } from "./src/lib/base";
import { initOptions } from "./src/lib/options";
import { initSendData } from "./src/lib/sendData";
import { initLineStatus } from "./src/lib/line-status";
import { initReplace } from "./src/lib/replace";
import { initError } from "./src/lib/error";
import { initRecordScreen } from "./src/lib/recordscreen";
import { initEvent } from "./src/lib/event";
import { initHttp } from "./src/lib/http";
import { initPerformance } from "./src/lib/performance";
import { initPv } from "./src/lib/pv";
import { initIntersection } from "./src/lib/intersectionObserver";
import { _global } from "./src/utils/global";

export const init = (options: InitOptions) => {
  if (_global.__roninzTrackInit__) return;
  if (!initOptions(options)) {
    return;
  }
  initReplace();
  initBase();
  initSendData();
  initLineStatus();

  initError();
  initEvent();
  initHttp();
  initPerformance();
  initPv();
  initRecordScreen();
  initIntersection();

  _global.__roninzTrackInit__ = true;
};

export * from './src/lib/exportMethods'
export * from './src/types'
