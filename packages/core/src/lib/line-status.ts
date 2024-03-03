/**
 * 监听网络状态
 * 当处于断网状态下的所有埋点事件都无效（认为此时采集的数据大部分是无效的）
 */
import { eventBus } from './eventBus';
import { EVENTTYPES } from '../common/constant';
import { debug } from '../utils/debug';

export class LineStatus {
  online: boolean = true;

  constructor() {
    this.init();
  }

  init() {
    eventBus.addEvent({
      type: EVENTTYPES.OFFLINE,
      callback: () => {
        debug('网络断开');
        this.online = false;
      },
    });

    eventBus.addEvent({
      type: EVENTTYPES.ONLINE,
      callback: () => {
        debug('网络连接');
        this.online = true;
      },
    });
  }
}

export let lineStatus: LineStatus;

export function initLineStatus() {
  lineStatus = new LineStatus();
}
