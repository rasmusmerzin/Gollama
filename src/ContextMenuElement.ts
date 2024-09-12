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

  setPosition(x: number, y: number) {
    x = Math.min(innerWidth - this.clientWidth, x);
    y = Math.min(innerHeight - this.clientHeight, y);
    this.style.setProperty("--x", x.toString());
    this.style.setProperty("--y", y.toString());
  }
}

customElements.define("context-menu-element", ContextMenuElement);
