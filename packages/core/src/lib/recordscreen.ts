import { record } from "rrweb";
import { options } from "./options";
import { RecordEventScope } from "../types";
import { getTimestamp } from "../utils";

const MAXSCOPETIME = 5000; // 每5s记录一个区间
const MAXSCOPELENGTH = 3; // 录屏数组最长长度 - 不要小于3
export let recordScreen: RecordScreen | undefined;

export class RecordScreen {
  public eventList: RecordEventScope[] = [
    {
      scope: `${getTimestamp()}-`,
      eventList: [],
    },
  ];

  constructor() {
    this.init();
  }

  init() {
    record({
      emit: (e, isCheckout) => {
        const lastEvents = this.eventList[this.eventList.length - 1];
        lastEvents.eventList.push(e);

        if (isCheckout) {
          if (this.eventList.length > 0) {
            this.eventList[this.eventList.length - 1].scope =
              lastEvents.scope + getTimestamp();
          }

          if (this.eventList.length > MAXSCOPELENGTH) {
            this.eventList.shift();
          }

          this.eventList.push({ scope: `${getTimestamp()}-`, eventList: [] });
        }
      },
      recordCanvas: true,
      checkoutEveryNms: MAXSCOPETIME,
    });
  }
}

// 获取录屏数据
export function getEventList() {
  return recordScreen?.eventList ?? [];
}

export function initRecordScreen() {
  recordScreen = options.recordScreen ? new RecordScreen() : undefined;
}
