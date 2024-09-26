export function createElement<K extends keyof HTMLElementTagNameMap>(
  key: K,
  properties: object = {},
  children: Array<HTMLElement> = [],
): HTMLElementTagNameMap[K] {
  document.createElement;
  const element = document.createElement(key);
  for (const child of children) element.append(child);
  for (const [key, value] of Object.entries(properties)) {
    if (key in element) (element as Record<string, unknown>)[key] = value;
    else element.setAttribute(key, String(value));
  }
  return element;
}
