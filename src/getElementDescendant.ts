export function getElementDescendant(
  element: HTMLElement,
  predicate: (e: HTMLElement) => boolean,
): HTMLElement | null {
  if (predicate(element)) return element;
  else if (element.parentElement)
    return getElementDescendant(element.parentElement, predicate);
  else return null;
}
