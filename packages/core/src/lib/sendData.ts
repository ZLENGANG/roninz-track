import { AnyFun, AnyObj } from '../types';
import {
  executeFunctions,
  getTimestamp,
  map,
  nextTime,
  randomBoolean,
  typeofAny,
} from '../utils';
import { debug } from '../utils/debug';
import { isArray, isFlase, logError } from '../utils/is';
import { refreshSession } from '../utils/session';
import { baseInfo } from './base';
import { lineStatus } from './line-status';
import { options } from './options';

export class SendData {
  private events: AnyObj[] = []; // 批次队列
  private timeoutID: any; // 延迟发送ID

  private send() {
    if (!this.events.length) return;

    // 选取首部的部分数据来发送,performance会一次性采集大量数据追加到events中
    const sendEvents = this.events.slice(0, options.cacheMaxLength); // 需要发送的事件
    this.events = this.events.slice(options.cacheMaxLength); // 剩下待发的事件

    const time = getTimestamp();
    const sendParams = {
      baseInfo: {
        ...baseInfo.base,
        sendTime: time,
        userUuid: options.userUuid,
      },
      eventInfo: map(sendEvents, (e: any) => {
        e.sendTime = time;
        return e;
      }),
    };

    const afterSendParams = executeFunctions(
      options.beforeSendData,
      false,
      sendParams
    );
    if (isFlase(afterSendParams)) return;
    if (!this.validateObject(afterSendParams, 'beforeSendData')) return;

    debug('send events', afterSendParams);

    this.executeSend(options.dsn, afterSendParams).then((res: any) => {
      executeFunctions(options.afterSendData, true, {
        ...res,
        params: afterSendParams,
      });
    });

    // 如果一次性发生的事件超过了阈值(cacheMaxLength)，那么这些经过裁剪的事件列表剩下的会直接发，并不会延迟等到下一个队列
    if (this.events.length) {
      nextTime(this.send.bind(this)); // 继续传输剩余内容,在下一个时间择机传输
    }
  }

  /**
   * 发送数据
   * @param url 目标地址
   * @param data 附带参数
   */
  private executeSend(url: string, data: any) {
    return Promise.resolve('ok')
  }

  public emit(e: AnyObj, flush = false) {
    if (!e) return;
    if (!lineStatus.online) return;
    if (!flush && !randomBoolean(options.tracesSampleRate as number)) return;
    if (!isArray(e)) e = [e];

    const eventList = executeFunctions(options.beforePushEventList, false, e);
    if (isFlase(eventList)) return;
    if (!this.validateObject(eventList, 'beforePushEventList')) return;

    this.events = this.events.concat(eventList);
    refreshSession();

    if (this.timeoutID) clearTimeout(this.timeoutID);

    // 满足最大记录数,立即发送,否则定时发送
    if (this.events.length >= options.cacheMaxLength || flush) {
      this.send();
    } else {
      this.timeoutID = setTimeout(() => {
        this.send();
      }, options.cacheWatingTime);
    }
  }

  /**
   * 验证选项的类型 - 只验证是否为 {} []
   * 返回 false意思是取消放入队列 / 取消发送
   */
  private validateObject(target: any, targetName: string): boolean | void {
    if (target === false) return false;

    if (!target) {
      logError(
        `NullError: ${targetName}期望返回 {} 或者 [] 类型，目前无返回值`
      );
      return false;
    }
    if (['object', 'array'].includes(typeofAny(target))) return true;
    logError(
      `TypeError: ${targetName}期望返回 {} 或者 [] 类型，目前是${typeofAny(
        target
      )}类型`
    );
    return false;
  }
}

export let sendData: SendData;
export function initSendData() {
  sendData = new SendData();
}
