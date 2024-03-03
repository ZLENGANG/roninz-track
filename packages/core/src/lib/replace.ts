import { EVENTTYPES } from '../common/constant';
import { isValidKey, on } from '../utils';
import { _global } from '../utils/global';
import { eventBus } from './eventBus';

export function initReplace() {
  for (const key in EVENTTYPES) {
    replace(key as EVENTTYPES);
  }
}

function replace(type: EVENTTYPES) {
  if (!isValidKey(type, EVENTTYPES)) return;
  const value = EVENTTYPES[type];
  switch (value) {
    case EVENTTYPES.OFFLINE:
      listenOffline(EVENTTYPES.OFFLINE);
      break;

    case EVENTTYPES.ONLINE:
      listenOnline(EVENTTYPES.ONLINE);
      break;

    default:
      break;
  }
}

/**
 * 监听 - online 网络是否开启
 */
function listenOnline(type: EVENTTYPES): void {
  on(
    _global,
    'online',
    function (e: Event) {
      eventBus.runEvent(type, e);
    },
    true
  );
}

/**
 * 监听 - offline 网络是否关闭
 */
function listenOffline(type: EVENTTYPES): void {
  on(
    _global,
    'offline',
    function (e: Event) {
      eventBus.runEvent(type, e);
    },
    true
  );
}
