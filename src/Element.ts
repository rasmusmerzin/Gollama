export class Element extends HTMLElement {
  control = new AbortController();
  signal = this.control.signal;

  remove() {
    this.control.abort();
    super.remove();
  }

  bind(target: EventTarget, type: string, fn?: (e: Event) => unknown) {
    if (!fn) fn = this.render.bind(this);
    target.addEventListener(type, fn, { signal: this.signal });
  }

  render() {
    //
  }
}
