import "./ImageElement.css";
import { Element } from "./Element";
import { createElement } from "./createElement";
import { ImageModalElement } from "./ImageModalElement";

export interface ImageOptions {
  src: string;
  alt: string;
  listed?: boolean;
}

export class ImageElement extends Element {
  img = createElement("img");

  constructor({ src, alt, listed }: Partial<ImageOptions> = {}) {
    super();
    if (src) this.img.src = src;
    if (listed) this.setAttribute("listed", "");
    this.img.alt = alt || "Image";
    this.append(this.img);
    this.onclick = () => new ImageModalElement(this);
  }

  getNeighbors() {
    let siblings = new Array<ImageElement>();
    if (this.hasAttribute("listed")) {
      const query = "image-element[listed]";
      siblings = Array.from(document.querySelectorAll(query));
    } else if (this.parentElement) {
      siblings = Array.from(
        this.parentElement.querySelectorAll("image-element"),
      );
    }
    const index = siblings.findIndex((e) => e === this);
    let previous: ImageElement | null = null;
    let next: ImageElement | null = null;
    if (index > 0) previous = siblings[index - 1];
    if (index < siblings.length - 1) next = siblings[index + 1];
    return { previous, next };
  }
}

customElements.define("image-element", ImageElement);
