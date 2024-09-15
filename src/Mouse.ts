export class Mouse {
  static instance: Mouse | null = null;
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
    addEventListener("click", this.onmouse.bind(this));
    addEventListener("wheel", this.onmouse.bind(this));
    addEventListener("contextmenu", this.onmouse.bind(this));
    addEventListener("keydown", this.keydown.bind(this));
  }

  keydown(event: KeyboardEvent) {
    this.focus = "keyboard";
    const { key, ctrlKey, altKey, target } = event;
    const modKey = ctrlKey || altKey;
    const main = document.querySelector("main");
    const modal = document.getElementById("modal");
    const input = document.getElementById("input");
    switch (key) {
      case "Enter":
        event.preventDefault();
        if (modKey) target?.dispatchEvent(new Event("contextmenu"));
        else (target as HTMLElement).click();
        break;
      case "Escape":
        (target as HTMLElement).blur();
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
        if (modal) break;
        main?.scrollTo(0, 0);
        break;
      case "End":
        if (modal) break;
        main?.scrollTo(0, main.scrollHeight);
        break;
      case "Tab":
      case "Shift":
      case "CapsLock":
        break;
      default:
        if (!modal && !modKey) input?.focus();
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
