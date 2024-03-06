import { DEVICE_KEY, SDK_VERSION } from '../common/config';
import { AnyObj } from '../types';
import { getCookieByName, uuid } from '../utils';
import { load } from '../utils/fingerprintjs';
import { getIPs } from '../utils/getIps';
import { getGlobal } from '../utils/global';
import { getSessionId } from '../utils/session';
import { options } from './options';

interface Device {
  clientHeight: number;
  clientWidth: number;
  colorDepth: number;
  pixelDepth: number;
  screenWidth: number;
  screenHeight: number;
  deviceId: string;
  vendor: string;
  platform: string;
  userAgent: string;
}

interface Base extends Device {
  userUuid: string;
  sdkUserUUid: string;
  ext: AnyObj;
  appName: string;
  appCode: string;
  pageId: string;
  sessionId: string;
  sdkVersion: string;
  ip: string;
}

export class BaseInfo {
  public base: Base | undefined;
  public pageId: string | undefined;
  private sdkUserUuid = '';
  private device: Device | undefined;

  constructor() {
    this.pageId = uuid();

    this.initSdkUserUuid().then(() => {
      this.initDevice();
      this.initBase();
    });
  }

  private initSdkUserUuid() {
    return load({})
      .then((fp: any) => fp.get())
      .then((result: any) => {
        const visitorId = result.visitorId;
        this.sdkUserUuid = visitorId;
      });
  }

  private initDevice() {
    const { screen } = getGlobal();
    const { clientWidth, clientHeight } = document.documentElement;
    const { width, height, colorDepth, pixelDepth } = screen;
    let deviceId = getCookieByName(DEVICE_KEY);

    if (!deviceId) {
      deviceId = `t_${uuid()}`;
      document.cookie = `${DEVICE_KEY}=${deviceId};path=/;`;
    }

    this.device = {
      clientHeight,
      clientWidth,
      colorDepth,
      pixelDepth,
      screenWidth: width,
      screenHeight: height,
      deviceId,
      vendor: navigator.vendor,
      platform: navigator.platform,
      userAgent: navigator.userAgent,
    };
  }

  private initBase() {
    const sessionId = getSessionId();

    getIPs().then((ips: any) => {
      this.base = {
        ...this.device,
        userUuid: uuid(),
        sdkUserUUid: this.sdkUserUuid,
        ext: options.ext || {},
        appName: options.appName,
        appCode: options.appCode as string,
        pageId: this.pageId as string,
        sessionId,
        sdkVersion: SDK_VERSION,
        ip: ips[1] || ips[0],
      } as Base;
    });
  }
}

export let baseInfo: BaseInfo;

export function initBase() {
  baseInfo = new BaseInfo();
}
