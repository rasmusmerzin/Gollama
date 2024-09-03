export class Element extends HTMLElement {
  control = new AbortController();

  remove() {
    this.control.abort();
    super.remove();
  }
}
