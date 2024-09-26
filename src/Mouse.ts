import { getElementDescendant } from "./getElementDescendant";

export class Mouse {
  static instance?: Mouse;
  static get() {
    if (this.instance) return this.instance;
    this.instance = new Mouse();
    return this.instance;
  }

  x = 0;
  y = 0;
  focus: "keyboard" | "mouse" | null = null;

  constructor() {
    addEventListener("mousemove", this.onmouse.bind(this));
    addEventListener("mousedown", this.onmouse.bind(this));
    addEventListener("mouseup", this.onmouse.bind(this));
    addEventListener("wheel", this.onmouse.bind(this));
    addEventListener("contextmenu", this.onmouse.bind(this));
    addEventListener("keydown", this.keydown.bind(this));
    addEventListener("contextmenu", (e) => e.preventDefault());
  }

  click(event: MouseEvent) {
    this.onmouse(event);
    const target = event.target as HTMLElement;
    if (target.tabIndex >= 0) target.focus();
  }

  keydown(event: KeyboardEvent) {
    this.focus = "keyboard";
    const { key, ctrlKey, altKey } = event;
    const target = event.target as HTMLElement;
    const modKey = ctrlKey || altKey;
    const main = document.querySelector("main");
    const modal = document.getElementById("modal");
    const input = document.getElementById("input");
    const is_text_input =
      target.nodeName === "INPUT" &&
      (target as HTMLInputElement).type === "text";
    const form = getElementDescendant(
      target,
      (e) => e.nodeName === "FORM",
    ) as HTMLFormElement;
    switch (key) {
      case "I":
        if (ctrlKey) open("devtools");
        break;
      case "w":
        if (ctrlKey) window.close();
        break;
      case " ":
        if (is_text_input) break;
        event.preventDefault();
        if (target.nodeName === "BODY") input?.focus();
        else if (modKey) target?.dispatchEvent(new Event("contextmenu"));
        else target.click();
        break;
      case "Enter":
        event.preventDefault();
        if (is_text_input && form) form.dispatchEvent(new Event("submit"));
        else if (modKey) target?.dispatchEvent(new Event("contextmenu"));
        else target.click();
        break;
      case "Escape":
        target.blur();
        break;
      case "ArrowDown":
        event.preventDefault();
        if (modal) break;
        if (modKey) main?.scrollTo(0, main.scrollHeight);
        else main?.scrollBy({ top: 100 });
        break;
      case "ArrowUp":
        event.preventDefault();
        if (modal) break;
        if (modKey) main?.scrollTo(0, 0);
        else main?.scrollBy({ top: -100 });
        break;
      case "Home":
        if (is_text_input) break;
        if (modal) break;
        main?.scrollTo(0, 0);
        break;
      case "End":
        if (is_text_input) break;
        if (modal) break;
        main?.scrollTo(0, main.scrollHeight);
        break;
      case "Tab":
      case "Shift":
      case "CapsLock":
        break;
      default:
        if (!modal && !modKey && key.length === 1) input?.focus();
        break;
    }
  }

  onmouse({ clientX, clientY }: MouseEvent) {
    this.focus = "mouse";
    this.x = clientX;
    this.y = clientY;
  }
}

Mouse.get();
