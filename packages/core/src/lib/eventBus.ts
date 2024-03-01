import { EVENTTYPES } from "../common/constant";
import { AnyFun } from "../types";

type Handlers = {
  [key in EVENTTYPES]?: AnyFun[];
};

export class EventBus {
  private handlers: Handlers;

  constructor() {
    this.handlers = {};
  }
}

export const eventBus = new EventBus();
