import { options } from "./options";

export function initPv() {
  if (!options.pv.core) return;
  console.log(options);
}
