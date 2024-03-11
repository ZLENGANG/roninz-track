import { EVENTTYPES, SENDID } from "../common/constant";
import { getTimestamp, isValidKey, on, parseGetParams } from "../utils";
import { handleSendError } from "./error";
import { eventBus } from "./eventBus";
import { options } from "./options";

class RequestTemplate {
  requestUrl = "";
  requestMethods = "";
  requestParams = {};
  triggerTime = -1;
  constructor(config = {}) {
    Object.keys(config).forEach((key) => {
      if (isValidKey(key, config)) {
        this[key] = config[key] || null;
      }
    });
  }
}

/**
 * fetch请求拦截
 */
function interceptFetch(): void {
  eventBus.addEvent({
    type: EVENTTYPES.FETCH,
    callback: (
      reqUrl: string,
      _options: Partial<Request> = {},
      res: Response,
      fetchStart: number
    ) => {
      const { method = "GET", body } = _options;
      const { url, status, statusText } = res;
      const requestMethod = String(method).toLocaleLowerCase();

      if (status === 200 || status === 304) {
        if (options.performance.server) {
          const _sendParams = {
            eventId: SENDID.SERVER,
            requestUrl: url,
            duration: getTimestamp() - fetchStart,
            responseStatus: status,
            requestMethod,
            requestType: "fetch",
            params:
              method.toUpperCase() === "POST" ? body : parseGetParams(url),
          };
          console.log(_sendParams);
        }
      } else if (options.error.server) {
        handleSendError({
          eventId: SENDID.SERVER,
          errMessage: statusText,
          requestUrl: url,
          responseStatus: status,
          requestMethod,
          requestType: "fetch",
          params: method.toUpperCase() === "POST" ? body : parseGetParams(url),
        });
      }
    },
  });
}

/**
 * xhr 请求拦截
 */
function interceptXHR(): void {
  const _config = new RequestTemplate();

  eventBus.addEvent({
    type: EVENTTYPES.XHROPEN,
    callback: (methods, url) => {
      _config.requestUrl = url;
      _config.requestMethods = String(methods).toLocaleLowerCase();
      _config.requestParams = parseGetParams(url);
    },
  });

  eventBus.addEvent({
    type: EVENTTYPES.XHRSEND,
    callback: (that: XMLHttpRequest & any, body) => {
      on(that, EVENTTYPES.READYSTATECHANGE, () => {
        const { readyState, status, responseURL, responseText, statusText } =
          that;
        if (readyState === 4) {
          const requestUrl = responseURL || _config.requestUrl;
          if (status === 200 || status === 304) {
            if (options.performance.server) {
              const _sendParams = {
                eventId: SENDID.SERVER,
                requestUrl,
                requestMethod: _config.requestMethods,
                requestType: "xhr",
                responseStatus: status,
                duration: getTimestamp() - _config.triggerTime,
                params:
                  _config.requestMethods === "post"
                    ? body
                    : _config.requestParams,
              };
              console.log(_sendParams);
            }
          } else if (options.error.server) {
            handleSendError({
              eventId: SENDID.SERVER,
              errMessage: statusText || responseText,
              requestUrl,
              requestMethod: _config.requestMethods,
              requestType: "xhr",
              responseStatus: status,
              params:
                _config.requestMethods === "post"
                  ? body
                  : _config.requestParams,
            });
          }
        }
      });

      _config.triggerTime = getTimestamp();
    },
  });
}

/**
 * 初始化http监控
 */
export function initHttp() {
  if (!options.error.server) return;
  interceptXHR();
  interceptFetch();
}
