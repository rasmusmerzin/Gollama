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
    document.getElementById("context-menu")?.remove();
    this.id = "context-menu";
    this.target = target;
    for (const option of options) {
      const button = document.createElement("button");
      button.innerText = option.name;
      button.onclick = option.action;
      if (option.color) button.style.setProperty("--color", option.color);
      this.append(button);
    }
    if (target) target.after(this);
    else document.body.append(this);
    setTimeout(() => {
      this.target?.classList.add("context-menu-focus");
      this.bind(window, "click", () => this.remove());
      this.bind(window, "contextmenu", () => this.remove());
      this.bind(window, "wheel", () => this.remove());
      this.bind(window, "keydown", this.keydown.bind(this));
      this.setPosition();
    });
  }

  setPosition() {
    let x = this.mouse.x;
    let y = this.mouse.y;
    if (this.mouse.focus !== "mouse" && this.target) {
      const { left, top, bottom, right } = this.target.getBoundingClientRect();
      x = (right + left) / 2;
      y = (top + bottom) / 2;
    }
    x = Math.min(innerWidth - this.clientWidth, x);
    y = Math.min(innerHeight - this.clientHeight, y);
    this.style.setProperty("--x", x.toString());
    this.style.setProperty("--y", y.toString());
  }

  remove() {
    super.remove();
    this.target?.classList.remove("context-menu-focus");
  }

  keydown(event: Event) {
    const { key } = event as KeyboardEvent;
    if (key === "Escape") this.remove();
  }
}

customElements.define("context-menu-element", ContextMenuElement);
