import { AnyFun, InitOptions, InternalOptions } from "../types";
import { deepAssign, typeofAny } from "../utils";
import { isEmpty, logError } from "../utils/is";

export class Options implements InternalOptions {
  dsn = ""; // 上报地址
  appName = ""; // 应用名称
  appCode = ""; // 应用code
  appVersion = "";
  debug = false;
  recordScreen = true;
  tracesSampleRate = 1;
  userUuid = "";
  cacheMaxLength = 5;
  cacheWatingTime = 5000;
  sendTypeByXmlBody = false;
  scopeError = false;

  error = {
    core: true,
    server: true,
  };

  event = {
    core: false,
  };

  performance = {
    core: false, // 性能数据-是否采集静态资源、接口的相关数据
    firstResource: false, // 性能数据-是否采集首次进入页面的数据(ps: tcp连接耗时,HTML加载完成时间,首次可交互时间)
    server: false, // 接口请求-是否采集接口请求(成功的才会采集)
  };

  ext = {};

  beforePushEventList: AnyFun[] = [];
  beforeSendData: AnyFun[] = [];
  afterSendData: AnyFun[] = [];

  constructor(initOptions: InitOptions) {
    const _options = this.transitionOptions(initOptions);
    deepAssign<Options>(this, _options);
  }

  /**
   * 对入参配置项进行转换
   */
  private transitionOptions(options: InitOptions): Options {
    const _options = deepAssign<Options>({}, this, options);
    const { error, event, performance } = _options;
    const { beforePushEventList, beforeSendData, afterSendData } = options;

    if (typeof error === "boolean") {
      _options.error = {
        core: error,
        server: error,
      };
    }

    if (typeof event === "boolean") {
      _options.event = {
        core: event,
      };
    }

    if (typeof performance === "boolean") {
      _options.performance = {
        core: performance,
        firstResource: performance,
        server: performance,
      };
    }

    if (beforePushEventList) {
      _options.beforePushEventList = [beforePushEventList];
    }

    if (beforeSendData) {
      _options.beforeSendData = [beforeSendData];
    }

    if (afterSendData) {
      _options.afterSendData = [afterSendData];
    }
    return _options;
  }
}

/**
 * 验证必填项
 * @param options 入参对象
 */
function _validateMustFill(options: InitOptions) {
  const validateList = [
    validateOptionMustFill(options.appName, "appName"),
    validateOptionMustFill(options.dsn, "dsn"),
  ];

  return validateList.every((res) => !!res);
}

/**
 * 验证必填项
 * @param target 属性值
 * @param targetName 属性名
 * @returns 是否通过验证
 */
function validateOptionMustFill(target: any, targetName: string): boolean {
  if (isEmpty(target)) {
    logError(`【${targetName}】参数必填`);
    return false;
  }
  return true;
}

/**
 * 验证选项的类型是否符合要求
 * @param target 源对象
 * @param targetName 对象名
 * @param expectType 期望类型
 * @returns 是否通过验证
 */
function validateOption(
  target: any,
  targetName: string,
  expectType: string
): boolean | void {
  if (!target || typeofAny(target) === expectType) return true;
  logError(
    `TypeError:【${targetName}】期望传入${expectType}类型，目前是${typeofAny(
      target
    )}类型`
  );
  return false;
}

function _validateInitOption(options: InitOptions) {
  const {
    dsn,
    appName,
    appCode,
    appVersion,
    userUuid,
    debug,
    recordScreen,
    error,
    ext,
    tracesSampleRate,
    cacheMaxLength,
    cacheWatingTime,
    sendTypeByXmlBody,
    scopeError,
    event,
    performance,

    beforePushEventList,
    beforeSendData,
    afterSendData,
  } = options;

  const validateFunList = [];

  if (error && typeof error === "object") {
    validateFunList.push(
      validateOption(error.core, "error.core", "boolean"),
      validateOption(error.server, "error.server", "boolean")
    );
  } else {
    validateFunList.push(validateOption(error, "error", "boolean"));
  }

  if (event && typeof event === "object") {
    validateFunList.push(validateOption(event.core, "event.core", "boolean"));
  } else {
    validateFunList.push(validateOption(event, "event", "boolean"));
  }

  if (performance && typeof performance === "object") {
    validateFunList.push(
      validateOption(performance.core, "performance.core", "boolean"),
      validateOption(performance.server, "performance.server", "boolean"),
      validateOption(
        performance.firstResource,
        "performance.firstResource",
        "boolean"
      )
    );
  } else {
    validateFunList.push(validateOption(performance, "performance", "boolean"));
  }

  const validateList = [
    validateOption(dsn, "dsn", "string"),
    validateOption(appName, "appName", "string"),
    validateOption(appCode, "appCode", "string"),
    validateOption(appVersion, "appVersion", "string"),
    validateOption(userUuid, "userUuid", "string"),
    validateOption(debug, "debug", "boolean"),
    validateOption(recordScreen, "recordScreen", "boolean"),
    validateOption(cacheMaxLength, "cacheMaxLength", "number"),
    validateOption(cacheWatingTime, "cacheWatingTime", "number"),

    validateOption(ext, "ext", "object"),
    validateOption(tracesSampleRate, "tracesSampleRate", "number"),
    validateOption(sendTypeByXmlBody, "sendTypeByXmlBody", "boolean"),
    validateOption(scopeError, "scopeError", "boolean"),

    validateOption(beforePushEventList, "beforePushEventList", "function"),
    validateOption(beforeSendData, "beforeSendData", "function"),
    validateOption(afterSendData, "afterSendData", "function"),
  ];

  return (
    validateList.every((res) => !!res) && validateFunList.every((res) => !!res)
  );
}

export let options: InternalOptions;

/**
 * 初始化参数
 * @param initOptions 原始参数
 * @returns 是否初始化成功
 */
export function initOptions(initOptions: InitOptions): boolean {
  // 必传校验 && 入参类型校验
  if (!_validateMustFill(initOptions) || !_validateInitOption(initOptions))
    return false;
  options = new Options(initOptions);
  return true;
}
