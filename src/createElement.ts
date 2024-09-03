export function createElement<K extends keyof HTMLElementTagNameMap>(
  key: K,
  properties: object = {},
): HTMLElementTagNameMap[K] {
  document.createElement;
  const element = document.createElement(key);
  return Object.assign(element, properties);
}
