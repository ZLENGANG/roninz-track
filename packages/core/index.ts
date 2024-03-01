import { InitOptions } from "./src/types";
import { initBase } from "./src/lib/base";
import { initOptions } from "./src/lib/options";
import { initSendData } from "./src/lib/sendData";
import { initLineStatus } from "./src/lib/line-status";

export const init = (options: InitOptions) => {
  if (!initOptions(options)) {
    return;
  }
  initBase();
  initSendData();
  initLineStatus();
};
