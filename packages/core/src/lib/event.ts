import { EVENTTYPES } from '../common/constant';
import { eventBus } from './eventBus';
import { options } from './options';

/**
 * 点击事件
 */
function clickCollection() {
  eventBus.addEvent({
    type: EVENTTYPES.CLICK,
    callback: (e: Event) => {
      console.log(e);
    },
  });
}

export function initEvent() {
  options.event.core && clickCollection();
}
