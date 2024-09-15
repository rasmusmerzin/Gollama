import "./ImageElement.css";
import { Element } from "./Element";
import { createElement } from "./createElement";

export interface ImageOptions {
  src: string;
  alt: string;
}

export class ImageElement extends Element {
  img = createElement("img");

  constructor({ src, alt }: Partial<ImageOptions> = {}) {
    super();
    this.tabIndex = 0;
    if (src) this.img.src = src;
    this.img.alt = alt || "Image";
    this.append(this.img);
    this.bind(this, "click", this.toggle.bind(this));
    this.onblur = this.close.bind(this);
  }

  get open() {
    return this.classList.contains("open");
  }

  toggle() {
    if (this.open) this.classList.remove("open");
    else {
      this.classList.add("open");
      this.focus();
    }
  }

  close() {
    this.classList.remove("open");
  }
}

customElements.define("image-element", ImageElement);
