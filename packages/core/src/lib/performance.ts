import { EVENTTYPES } from '../common/constant';
import { eventBus } from './eventBus';
import { options } from './options';

export function initPerformance() {
  if (!options.performance.core && !options.performance.firstResource) return;

  eventBus.addEvent({
    type: EVENTTYPES.LOAD,
    callback: () => {
      console.log('zlzl', document.readyState);
    },
  });
}
