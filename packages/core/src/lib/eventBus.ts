import { EVENTTYPES } from '../common/constant';
import { AnyFun } from '../types';

type Handlers = {
  [key in EVENTTYPES]?: AnyFun[];
};

interface EventHandler {
  type: EVENTTYPES;
  callback: AnyFun;
}

export class EventBus {
  private handlers: Handlers;

  constructor() {
    this.handlers = {};
  }

  /**
   * 为目标类型事件添加回调
   * @param handler 需要被添加的类型以及回调函数
   */
  addEvent(handler: EventHandler) {
    !this.handlers[handler.type] && (this.handlers[handler.type] = []);
    this.handlers[handler.type]?.push(handler.callback);
  }

  /**
   * 获取目标类型事件所有的回调
   * @param type 事件类型
   */
  getEvent(type: EVENTTYPES): AnyFun[] {
    return this.handlers[type] || [];
  }

  /**
   * 执行目标类型事件所有的回调
   * @param type 事件类型
   * @param args 额外参数
   */
  runEvent(type: EVENTTYPES, ...args: any[]) {
    const allEvent = this.getEvent(type);
    allEvent.forEach((fun) => {
      fun(...args);
    });
  }
}

export const eventBus = new EventBus();
