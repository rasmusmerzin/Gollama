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
    const { key, target } = event;
    const main = document.querySelector("main");
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
        main?.scrollBy({ top: 100 });
        break;
      case "ArrowUp":
        event.preventDefault();
        main?.scrollBy({ top: -100 });
        break;
    }
  }

  onmouse({ clientX, clientY }: MouseEvent) {
    this.x = clientX;
    this.y = clientY;
  }
}

Mouse.get();
