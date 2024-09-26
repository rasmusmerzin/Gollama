import "./Modal.css";
import { Element } from "./Element";
import { createElement } from "./createElement";
import { RouteStore } from "./RouteStore";

export class Modal extends Element {
  route_store = RouteStore.get();
  container = createElement("div", { className: "container" });
  restores = new Array<() => unknown>();

  constructor() {
    super();
    document.getElementById("modal")?.remove();
    this.id = "modal";
    this.append(this.container);
    this.bind(this.container, "click", (event) => event.stopPropagation());
    this.bind(this, "click", () => this.remove());
    this.bind(window, "keydown", (event: Event) => {
      const { key } = event as KeyboardEvent;
      if (key === "Escape") this.remove();
    });
    this.disableBackgroundTabs(document.body);
    this.route_store.setModal(this);
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
    if (this.route_store.modal === this) this.route_store.setModal(null);
  }
}
