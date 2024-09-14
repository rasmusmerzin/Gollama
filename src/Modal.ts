import "./Modal.css";
import { Element } from "./Element";
import { createElement } from "./createElement";

export class Modal extends Element {
  container = createElement("div", { className: "container" });

  constructor() {
    super();
    this.id = "modal";
    this.classList.add("modal");
    this.append(this.container);
    this.bind(window, "keydown", this.keydown.bind(this));
    this.bind(this.container, "click", (event) => event.stopPropagation());
    this.bind(this, "click", () => this.remove());
    document.body.append(this);
  }

  keydown(event: Event) {
    const { key } = event as KeyboardEvent;
    if (key === "Escape") this.remove();
  }
}
