export function createElement<K extends keyof HTMLElementTagNameMap>(
  key: K,
  properties: object = {},
  children: Array<HTMLElement> = [],
): HTMLElementTagNameMap[K] {
  document.createElement;
  const element = document.createElement(key);
  for (const child of children) element.append(child);
  return Object.assign(element, properties);
}
