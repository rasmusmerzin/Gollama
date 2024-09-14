import "./ContextMenuElement.css";
import { Element } from "./Element";
import { Mouse } from "./Mouse";

export interface ContextMenuOption {
  name: string;
  color?: string;
  action(): unknown;
}

export interface ContextMenuParams {
  options: Array<ContextMenuOption>;
  target?: HTMLElement;
}

export class ContextMenuElement extends Element {
  mouse = Mouse.get();
  target?: HTMLElement;

  constructor({ options, target }: ContextMenuParams) {
    super();
    this.target = target;
    for (const option of options) {
      const button = document.createElement("button");
      button.innerText = option.name;
      button.onclick = option.action;
      if (option.color) button.style.color = option.color;
      this.append(button);
    }
    document.body.append(this);
    setTimeout(() => {
      this.target?.classList.add("focus");
      this.bind(window, "click", () => this.remove());
      this.bind(window, "contextmenu", () => this.remove());
      this.bind(window, "wheel", () => this.remove());
      this.setPosition(this.mouse.x, this.mouse.y);
    });
  }

  setPosition(x: number, y: number) {
    x = Math.min(innerWidth - this.clientWidth, x);
    y = Math.min(innerHeight - this.clientHeight, y);
    this.style.setProperty("--x", x.toString());
    this.style.setProperty("--y", y.toString());
  }

  remove() {
    super.remove();
    this.target?.classList.remove("focus");
  }
}

customElements.define("context-menu-element", ContextMenuElement);
