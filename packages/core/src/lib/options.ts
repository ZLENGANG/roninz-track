import { AnyFun, InitOptions, InternalOptions } from "../types";

export class Options implements InternalOptions {
  dsn = ""; // 上报地址
  appName = ""; // 应用名称
  appCode = ""; // 应用code
  debug = false;
  error = {
    core: true,
    server: true,
  };
  recordScreen = true;
  tracesSampleRate = 1;
  beforePushEventList = [];

  constructor(options: InitOptions) {
    
  }
}

export let options: InitOptions;
export function initOptions(InitOptions: InitOptions): boolean {
  options = new Options(InitOptions);
  return true;
}
