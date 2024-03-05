import { record } from 'rrweb';
import { options } from './options';
import { RecordEventScope } from '../types';
import { getTimestamp } from '../utils';
import { Base64 } from 'js-base64';
import pako from 'pako';

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

export function zip(data: any) {
  if (!data) return data;

  // 判断数据是否需要转为JSON
  const dataJson =
    typeof data !== 'string' && typeof data !== 'number'
      ? JSON.stringify(data)
      : data;

  // 使用Base64.encode处理字符编码，兼容中文
  const str = Base64.encode(dataJson as string);

  // 通过使用pako.gzip对数据进行压缩，可以有效减少数据的大小，从而降低网络传输的成本和时间，提升性能。
  const binaryString = pako.gzip(str);
  const arr = Array.from(binaryString);
  let s = '';
  arr.forEach((item: number) => {
    s += String.fromCharCode(item);
  });

  return Base64.btoa(s);
}

// 获取录屏数据
export function getEventList() {
  return recordScreen?.eventList ?? [];
}

export function initRecordScreen() {
  recordScreen = options.recordScreen ? new RecordScreen() : undefined;
}
