import "./ImageListElement.css";
import { ImageElement } from "./ImageElement";

export class ImageListElement extends HTMLElement {
  listed?: boolean;
  max_count = 3;

  constructor({ listed, max_count }: Partial<ImageListElement> = {}) {
    super();
    this.listed = listed;
    if (max_count) this.max_count = max_count;
  }

  clear() {
    for (const child of Array.from(this.children)) child.remove();
    this.classList.remove("plenty");
  }

  add(...images: string[]) {
    for (const image of images) {
      const element = new ImageElement({
        listed: this.listed,
        src: "data:;base64," + image,
      });
      element.style.setProperty("--index", this.children.length.toString());
      this.append(element);
    }
    this.style.setProperty("--count", this.children.length.toString());
    if (this.children.length > this.max_count) this.classList.add("plenty");
  }
}

customElements.define("image-list-element", ImageListElement);
