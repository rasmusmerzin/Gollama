import "./ImageElement.css";
import { Element } from "./Element";
import { createElement } from "./createElement";

export interface ImageOptions {
  src: string;
  alt: string;
  listed?: boolean;
}

export class ImageElement extends Element {
  opened = false;

  img = createElement("img");
  left = createElement("div", { className: "left" });
  right = createElement("div", { className: "right" });

  constructor({ src, alt, listed }: Partial<ImageOptions> = {}) {
    super();
    if (src) this.img.src = src;
    if (listed) this.setAttribute("listed", "");
    this.img.alt = alt || "Image";
    this.append(this.img, this.left, this.right);
    this.left.onclick = this.leftClick.bind(this);
    this.right.onclick = this.rightClick.bind(this);
    this.onblur = this.close.bind(this);
    this.onclick = this.toggle.bind(this);
    this.onkeydown = this.keydown.bind(this);
  }

  toggle() {
    this.opened = !this.opened;
    this.render();
  }

  close() {
    this.opened = false;
    this.render();
  }

  leftClick(event: Event) {
    event.stopPropagation();
    this.getNeighbors().previous?.click();
  }

  rightClick(event: Event) {
    event.stopPropagation();
    this.getNeighbors().next?.click();
  }

  keydown(event: Event) {
    const { key, shiftKey } = event as KeyboardEvent;
    const arrow_previous = ["ArrowLeft", "ArrowUp"].includes(key);
    const arrow_next = ["ArrowRight", "ArrowDown"].includes(key);
    if (arrow_previous || (key === "Tab" && shiftKey)) {
      event.preventDefault();
      this.getNeighbors().previous?.click();
    } else if (arrow_next || (key == "Tab" && !shiftKey)) {
      event.preventDefault();
      this.getNeighbors().next?.click();
    }
  }

  render() {
    if (this.opened) {
      this.img.onclick = (e) => e.stopPropagation();
      const { previous, next } = this.getNeighbors();
      if (previous) this.left.classList.remove("disabled");
      else this.left.classList.add("disabled");
      if (next) this.right.classList.remove("disabled");
      else this.right.classList.add("disabled");
      this.classList.add("open");
      this.tabIndex = 0;
      this.focus();
    } else {
      this.img.onclick = null;
      this.tabIndex = -1;
      this.classList.remove("open");
    }
  }

  getNeighbors() {
    let siblings = new Array<HTMLElement>();
    if (this.hasAttribute("listed")) {
      const query = "image-element[listed]";
      siblings = Array.from(document.querySelectorAll(query));
    } else if (this.parentElement) {
      siblings = Array.from(
        this.parentElement.querySelectorAll("image-element"),
      );
    }
    const index = siblings.findIndex((e) => e === this);
    let previous: HTMLElement | null = null;
    let next: HTMLElement | null = null;
    if (index > 0) previous = siblings[index - 1];
    if (index < siblings.length - 1) next = siblings[index + 1];
    return { previous, next };
  }
}

customElements.define("image-element", ImageElement);
