/**
 * 是否为简单的标签
 * 简单标签数组：['em', 'b', 'strong', 'span', 'img', 'i', 'code']
 */
export function isSimpleEl(children: Element[]): boolean {
  if (children.length > 0) {
    const arr = ["em", "b", "strong", "span", "img", "i", "code"];
    const a = children.filter(
      ({ tagName }) => arr.indexOf(tagName.toLowerCase()) >= 0
    );
    return a.length === children.length;
  }
  return true;
}
