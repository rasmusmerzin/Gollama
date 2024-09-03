import "./ContextMenuElement.css";
import { Element } from "./Element";

export interface ContextMenuElementParameters {
  x: number;
  y: number;
  options: Array<{
    name: string;
    action(): unknown;
  }>;
}

export class ContextMenuElement extends Element {
  constructor({ x, y, options }: ContextMenuElementParameters) {
    super();
    this.style.setProperty("--x", x.toString());
    this.style.setProperty("--y", y.toString());
    for (const option of options) {
      const button = document.createElement("button");
      button.innerText = option.name;
      button.onclick = option.action;
      this.append(button);
    }
    addEventListener("click", () => this.remove(), this.control);
    document.body.append(this);
  }
}

customElements.define("context-menu-element", ContextMenuElement);
