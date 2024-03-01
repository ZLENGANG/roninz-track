import { version } from "../../package.json";

export const DEVICE_KEY = "roninz_track_device_id"; // 设备ID Key - 私有属性
export const SESSION_KEY = "roninz_track_session_id"; // 会话ID Key(一个站点只允许运行一个埋点程序) - 私有属性
export const SURVIVIE_MILLI_SECONDS = 1800000; // 会话 session存活时长(30minutes) - 私有属性
export const SDK_VERSION = version;
