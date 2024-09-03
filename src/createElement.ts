export function createElement(key: string, properties: object = {}) {
  const element = document.createElement(key);
  return Object.assign(element, properties);
}
