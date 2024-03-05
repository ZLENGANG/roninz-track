import { AnyFun, InitOptions } from '../types';

export class Options {
  dsn = ''; // 上报地址
  appName = ''; // 应用名称
  appCode: InitOptions['appCode'] = ''; // 应用code
  debug: InitOptions['debug'] = false;
  error: InitOptions['error'] = {
    core: true,
    server: true,
  };
  recordScreen: InitOptions['recordScreen'] = true;
  tracesSampleRate: InitOptions['tracesSampleRate'];
  beforePushEventList: InitOptions['beforePushEventList'] = undefined;

  constructor(options: InitOptions) {
    this.dsn = options.dsn;
    this.appName = options.appName;
    this.appCode = options.appCode;
    this.debug = options.debug;
    this.recordScreen = options.recordScreen || this.recordScreen;
    this.tracesSampleRate = options.tracesSampleRate || 0.5;
    this.beforePushEventList = options.beforePushEventList;

    if (options.error === false) {
      this.error = {
        core: false,
        server: false,
      };
    } else if (options.error === true) {
      this.error = {
        core: true,
        server: true,
      };
    } else {
      this.error = options.error ? options.error : this.error;
    }
  }
}

export let options: InitOptions;
export function initOptions(InitOptions: InitOptions): boolean {
  options = new Options(InitOptions);
  return true;
}
