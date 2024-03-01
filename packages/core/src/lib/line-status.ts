/**
 * 监听网络状态
 * 当处于断网状态下的所有埋点事件都无效（认为此时采集的数据大部分是无效的）
 */
export class LineStatus {
  online: boolean = true;

  constructor() {
    this.init();
  }

  init() {}
}

export let lineStatus: LineStatus;

export function initLineStatus() {
  lineStatus = new LineStatus();
}
