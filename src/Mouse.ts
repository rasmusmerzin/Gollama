export class Mouse {
  static instance: Mouse | null = null;
  static get() {
    if (this.instance) return this.instance;
    this.instance = new Mouse();
    return this.instance;
  }

  x = 0;
  y = 0;

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
    const { key, ctrlKey, target } = event;
    const main = document.querySelector("main");
    const modal = document.getElementById("modal");
    const input = document.getElementById("input");
    switch (key) {
      case " ":
      case "Enter":
        event.preventDefault();
        (target as HTMLElement).click();
        break;
      case "Escape":
        (target as HTMLElement).blur();
        break;
      case "ArrowDown":
        event.preventDefault();
        if (ctrlKey) main?.scrollTo(0, main.scrollHeight);
        else main?.scrollBy({ top: 100 });
        break;
      case "ArrowUp":
        event.preventDefault();
        if (ctrlKey) main?.scrollTo(0, 0);
        else main?.scrollBy({ top: -100 });
        break;
      case "Home":
        main?.scrollTo(0, 0);
        break;
      case "End":
        main?.scrollTo(0, main.scrollHeight);
        break;
      case "Tab":
      case "Shift":
      case "Control":
      case "CapsLock":
        break;
      default:
        if (!modal && !ctrlKey) input?.focus();
        break;
    }
  }

  onmouse({ clientX, clientY }: MouseEvent) {
    this.x = clientX;
    this.y = clientY;
  }
}

Mouse.get();
