import "./Modal.css";
import { Element } from "./Element";
import { createElement } from "./createElement";

export class Modal extends Element {
  container = createElement("div", { className: "container" });
  restores = new Array<() => unknown>();

  constructor() {
    super();
    document.getElementById("modal")?.remove();
    this.id = "modal";
    this.append(this.container);
    this.bind(window, "keydown", this.keydown.bind(this));
    this.bind(this.container, "click", (event) => event.stopPropagation());
    this.bind(this, "click", () => this.remove());
    this.disableBackgroundTabs(document.body);
    document.body.append(this);
  }

  disableBackgroundTabs(element: HTMLElement) {
    const index = element.tabIndex;
    this.restores.push(() => (element.tabIndex = index));
    element.tabIndex = -1;
    for (const child of element.children)
      if (child instanceof HTMLElement) this.disableBackgroundTabs(child);
  }

  remove() {
    super.remove();
    for (const restore of this.restores) restore();
  }

  keydown(event: Event) {
    const { key } = event as KeyboardEvent;
    if (key === "Escape") this.remove();
  }
}
