/**
 * 会话控制,此会话只和具体的浏览器相关,与业务无关,和业务意义上的登录态没有任何关联,只是用于追踪同一个浏览器上访问页面的动作
 */
import { SESSION_KEY, SURVIVIE_MILLI_SECONDS } from "../common/config";
import { getCookieByName, getTimestamp, uuid } from "./index";

/**
 * 刷新会话存续期
 */
export function refreshSession() {
  const sessionId = getCookieByName(SESSION_KEY) || `s_${uuid()}`;
  const expires = new Date(getTimestamp() + SURVIVIE_MILLI_SECONDS);
  document.cookie = `${SESSION_KEY}=${sessionId};max-age=1800;expires=${expires.toUTCString()}`;
  return sessionId;
}

refreshSession();

/**
 * 获取sessionid
 */
export function getSessionId() {
  return getCookieByName(SESSION_KEY) || refreshSession();
}
