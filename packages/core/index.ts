import { InitOptions } from "./src/types";
import { initBase } from "./src/lib/base";
import { initOptions } from "./src/lib/options";

export const init = (options: InitOptions) => {
  if (!initOptions(options)) {
    return;
  }
  initBase();
};
