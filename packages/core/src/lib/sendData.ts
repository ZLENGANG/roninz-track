import { AnyFun, AnyObj } from "../types";
import { executeFunctions, randomBoolean } from "../utils";
import { isArray } from "../utils/is";
import { lineStatus } from "./line-status";
import { options } from "./options";

export class SendData {
  public emit(e: AnyObj, flush = false) {
    if (!e) return;
    if (!lineStatus.online) return;
    if (!flush && !randomBoolean(options.tracesSampleRate as number)) return;
    if (!isArray(e)) e = [e];

    const eventList = executeFunctions(
      options.beforePushEventList
        ? ([options.beforePushEventList] as AnyFun[])
        : [],
      false,
      e
    );
  }
}

export let sendData: SendData;
export function initSendData() {
  sendData = new SendData();
}
