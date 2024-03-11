import { EVENTTYPES, SEDNEVENTTYPES } from "../common/constant";
import { getLocationHref, getTimestamp, isValidKey } from "../utils";
import { getElByAttr, getNodeXPath, isSimpleEl } from "./element";
import { eventBus } from "./eventBus";
import { options } from "./options";
import { sendData } from "./sendData";

class RequestTemplateClick {
  eventId = ""; // 事件ID
  eventType = ""; // 事件类型
  title = ""; // 事件名
  triggerPageUrl = ""; // 当前页面URL
  x = -1; // 被点击元素与屏幕左边距离
  y = -1; // 被点击元素与屏幕上边距离
  params = {}; // 事件参数
  elementPath = ""; // 被点击元素的层级
  triggerTime = -1; // 事件发生时间
  constructor(config = {}) {
    Object.keys(config).forEach((key) => {
      if (isValidKey(key, config)) {
        this[key] = config[key] || null;
      }
    });
  }
}

/**
 * 点击事件
 */
function clickCollection() {
  eventBus.addEvent({
    type: EVENTTYPES.CLICK,
    callback: (e: MouseEvent) => {
      const _config = new RequestTemplateClick({
        eventType: SEDNEVENTTYPES.CLICK,
      });

      // 获取被点击的元素到最外层元素组成的数组
      const path: HTMLElement[] = e.composedPath()
        ? (e.composedPath() as HTMLElement[])
        : e.target
        ? getNodePath(e.target as HTMLElement)
        : [];

      // 检查被点击的元素以及其父级元素是否有这些属性(从内到外)
      const target = path.find(
        (el) =>
          el.hasAttribute &&
          (el.hasAttribute("track-container") ||
            el.hasAttribute("track-id") ||
            el.hasAttribute("track-title"))
      );

      if (!target) return;

      const { scrollTop, scrollLeft } = document.documentElement;
      const { top, left } = (e.target as HTMLElement).getBoundingClientRect();

      _config.x = left + scrollLeft;
      _config.y = top + scrollTop;
      _config.triggerTime = getTimestamp();
      _config.triggerPageUrl = getLocationHref();
      _config.title = extractTitleByTarget(target);
      _config.eventId = extractDataByPath(path); // 提取数据事件ID
      _config.params = extractParamsByPath(path); // 提取数据参数
      _config.elementPath = getNodeXPath(target).slice(-128); // 长度限制128字符

      sendData.emit(_config);
    },
  });
}

/**
 * 提取数据参数
 * 如果本身节点没有埋点属性的话会用父级埋点属性
 */
function extractParamsByPath(list: HTMLElement[] = []) {
  const regx = /^track-/;
  let target;
  let targetIndex = -1;

  // 遍历从子节点到body下最大的节点,遍历他们的属性,直到某个节点的属性能通过校验的节点
  for (let i = 0; i < list.length; i++) {
    const el = list[i];
    const attributes = (el && el.attributes && Array.from(el.attributes)) || [];
    target = attributes.find((item) =>
      item.nodeName.match(regx)
        ? item.nodeName.match(regx)
        : item.nodeName.indexOf("track-container") !== -1
    );
    if (target) {
      targetIndex = i;
      break;
    }
  }

  if (targetIndex < 0) return {};
  const container = list[targetIndex];
  const attrList = Array.from(container.attributes) || [];
  const params: Record<string, string | null> = {};
  const defaultKey = ["container", "title", "id"];
  attrList.forEach((item) => {
    if (item.nodeName.indexOf("track") < 0) return; // 过滤非标准命名 如 data-v-fbcf7454
    const key = item.nodeName.replace(regx, "");
    if (defaultKey.includes(key)) return; // 过滤sdk自定义属性
    params[key] = item.nodeValue;
  });

  return params;
}

/**
 * 提取数据事件ID
 */
function extractDataByPath(list: HTMLElement[] = []) {
  const hasIdEl = getElByAttr(list, "track-id");
  if (hasIdEl) return hasIdEl.getAttribute("track-id")!;

  const hasTitleEl = getElByAttr(list, "title");
  if (hasTitleEl) return hasTitleEl.getAttribute("title")!;

  const container = getElByAttr(list, "track-container");
  if (container) {
    if (container.getAttribute("track-id")) {
      return container.getAttribute("track-id")!;
    }
    if (container.getAttribute("title")) {
      return container.getAttribute("title")!;
    }
    const id2 = container.getAttribute("track-container")!;
    if (typeof id2 === "string" && id2) return id2;
  }

  // 都没有则以 tagname 去当做ID
  return list[0].tagName.toLowerCase();
}

function extractTitleByTarget(target: HTMLElement) {
  const selfTitle = getNodeTitle(target);
  if (selfTitle) return selfTitle;

  // 向上找其父节点
  let container = target.parentElement;

  while (container && container !== document.body) {
    if (container.hasAttribute("track-container")) {
      break;
    }
    container = container.parentElement;
  }

  const superTitle = getNodeTitle(container);
  if (superTitle) return superTitle;

  // 自身以及父级都没有拿到 title 值的情况下
  const { tagName } = target;
  return !target.hasChildNodes() || tagName.toLowerCase() === "svg"
    ? handleLeafNode(target)
    : handleNoLeafNode(target);
}

/**
 * 获取 title - 非叶子元素的情况
 */
function handleNoLeafNode(target: Element) {
  const { tagName, textContent } = target;
  if (tagName === "A") {
    const res = isSimpleEl([...Array.from(target.children)]);
    return res ? textContent : target.getAttribute("href") || null;
  }
  if (tagName === "BUTTON") {
    const name = target.getAttribute("name");
    const res = isSimpleEl([...Array.from(target.children)]);
    return name || res ? textContent : target.getAttribute("href") || null;
  }
  const { length } = [...Array.from(target.children)].filter(() =>
    target.hasChildNodes()
  );
  return length > 0 ? null : textContent;
}

/**
 * 获取 title - 叶子元素的情况下，取其特殊值
 * 叶子元素(也就是不包含其他HTML元素,也不能有文本内容，如img，svg标签)
 */
function handleLeafNode(target: any) {
  const { textContent, tagName } = target;
  if (tagName === "IMG") {
    return target.getAttribute("alt") || null;
  }
  if (tagName === "svg") {
    const a = [...Array(target.children)].find(
      (item) => item.tagName === "use"
    );
    if (a) return a.getAttribute("xlink:href") || null;
  }
  return textContent;
}

/**
 * 获取元素的 track-title 属性或者 title属性
 */
function getNodeTitle(node: HTMLElement | null) {
  if (node) {
    return node.hasAttribute("track-title")
      ? node.getAttribute("track-title")
      : node.title;
  }
  return "";
}

/**
 * 获取目标元素到最外层元素组成的数组
 */
function getNodePath(
  node: HTMLElement,
  options = { includeSelf: true, order: "asc" }
) {
  if (!node) return [];
  const { includeSelf, order } = options;
  let parent = includeSelf ? node : node.parentElement;
  let result: HTMLElement[] = [];
  while (parent) {
    result = order === "asc" ? result.concat(parent) : [parent].concat(result);
    parent = parent.parentElement;
  }
  return result;
}

export function initEvent() {
  options.event.core && clickCollection();
}
