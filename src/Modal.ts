import "./Modal.css";
import { Element } from "./Element";
import { createElement } from "./createElement";

export class Modal extends Element {
  container = createElement("div", { className: "container" });

  constructor() {
    super();
    this.append(this.container);
    this.classList.add("modal");
    this.bind(window, "keydown", this.keydown.bind(this));
    document.body.append(this);
  }

  keydown(event: Event) {
    const { key } = event as KeyboardEvent;
    if (key === "Escape") this.remove();
  }
}
