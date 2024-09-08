import "./ContextMenuElement.css";
import { Element } from "./Element";
import { Mouse } from "./Mouse";

export type ContextMenuOption = {
  name: string;
  color?: string;
  action(): unknown;
};

export class ContextMenuElement extends Element {
  mouse = Mouse.get();

  constructor(options: Array<ContextMenuOption>) {
    super();
    for (const option of options) {
      const button = document.createElement("button");
      button.innerText = option.name;
      button.onclick = option.action;
      if (option.color) button.style.color = option.color;
      this.append(button);
    }
    document.body.append(this);
    setTimeout(() => {
      this.bind(window, "click", () => this.remove());
      this.bind(window, "contextmenu", () => this.remove());
      this.setPosition(this.mouse.x, this.mouse.y);
    });
  }

  getSize() {
    const { left, top, right, bottom } = this.getBoundingClientRect();
    return { x: right - left, y: bottom - top };
  }

  setPosition(x: number, y: number) {
    const size = this.getSize();
    x = Math.min(innerWidth - size.x, x);
    y = Math.min(innerHeight - size.y, y);
    this.style.setProperty("--x", x.toString());
    this.style.setProperty("--y", y.toString());
  }
}

customElements.define("context-menu-element", ContextMenuElement);
