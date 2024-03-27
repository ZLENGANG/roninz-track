import { TargetGather } from "../types";
import { validateMethods } from "../utils";
import { intersection } from "./intersectionObserver";

/**
 * 曝光 - 对目标元素进行监听
 * @param params 附带的额外参数
 */
export function intersectionObserver(gather: TargetGather): void {
  if (!validateMethods("intersectionObserver")) return;
  intersection.observe(gather);
}
