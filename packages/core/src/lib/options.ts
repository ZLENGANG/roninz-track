import { InitOptions } from '../types';

export class Options {
  dsn = ''; // 上报地址
  appName = ''; // 应用名称
  appCode: InitOptions['appCode'] = ''; // 应用code
  debug: InitOptions['debug'] = false;

  constructor(options: InitOptions) {
    this.dsn = options.dsn;
    this.appName = options.appName;
    this.appCode = options.appCode;
    this.debug = options.debug;
  }
}

export let options: InitOptions;
export function initOptions(InitOptions: InitOptions): boolean {
  options = new Options(InitOptions);
  return true;
}
