export type Listener = (event: Event) => unknown;
export class Element extends HTMLElement {
  control = new AbortController();
  binds = new Map<EventTarget, Set<string>>();

  get signal() {
    return this.control.signal;
  }

  remove() {
    this.control.abort();
    this.binds.clear();
    super.remove();
  }

  bind(target: EventTarget, type: string, fn?: (e: Event) => unknown) {
    if (this.signal.aborted) this.control = new AbortController();
    if (!fn) fn = this.render.bind(this);
    let bind_map = this.binds.get(target);
    if (!bind_map) this.binds.set(target, (bind_map = new Set<string>()));
    if (bind_map.has(type)) return;
    bind_map.add(type);
    target.addEventListener(type, fn, { signal: this.signal });
  }

  render() {
    //
  }
}
