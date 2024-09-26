export type Listener = (event: Event) => unknown;
export class Element extends HTMLElement {
  control = new AbortController();

  get signal() {
    return this.control.signal;
  }

  remove() {
    this.control.abort();
    super.remove();
  }

  bind(target: EventTarget, type: string, fn?: (e: Event) => unknown) {
    if (this.signal.aborted) this.control = new AbortController();
    if (!fn) fn = this.render.bind(this);
    target.addEventListener(type, fn, { signal: this.signal });
  }

  render() {
    //
  }
}
