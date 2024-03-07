import { InitOptions } from './src/types';
import { initBase } from './src/lib/base';
import { initOptions } from './src/lib/options';
import { initSendData } from './src/lib/sendData';
import { initLineStatus } from './src/lib/line-status';
import { initReplace } from './src/lib/replace';
import { initError } from './src/lib/error';
import { initRecordScreen } from './src/lib/recordscreen';
import { initEvent } from './src/lib/event';

export const init = (options: InitOptions) => {
  if (!initOptions(options)) {
    return;
  }
  initReplace();
  initBase();
  initSendData();
  initLineStatus();

  initError();
  initEvent();
  initRecordScreen();
};
