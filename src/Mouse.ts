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
  }

  onmouse({ clientX, clientY }: MouseEvent) {
    this.x = clientX;
    this.y = clientY;
  }
}
