export function elementHasDescendant(
  element: HTMLElement,
  predicate: (e: HTMLElement) => boolean,
): boolean {
  if (predicate(element)) return true;
  else if (element.parentElement)
    return elementHasDescendant(element.parentElement, predicate);
  else return false;
}
