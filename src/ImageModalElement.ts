import "./ImageModalElement.css";
import { ImageElement } from "./ImageElement";
import { Modal } from "./Modal";
import { createElement } from "./createElement";

export class ImageModalElement extends Modal {
  img = createElement("img");
  left = createElement("button", {
    className: "material-icons left",
    innerText: "chevron_left",
  });
  right = createElement("button", {
    className: "material-icons right",
    innerText: "chevron_right",
  });

  constructor(private element: ImageElement) {
    super();
    this.replaceChildren(this.img, this.left, this.right);
    this.img.onclick = (e) => e.stopPropagation();
    this.left.onclick = this.leftClick.bind(this);
    this.right.onclick = this.rightClick.bind(this);
    this.bind(window, "keydown", this.keydown.bind(this));
    this.render();
  }

  keydown(event: Event) {
    const { key } = event as KeyboardEvent;
    switch (key) {
      case "ArrowLeft":
      case "ArrowUp":
        this.left.click();
        break;
      case "ArrowRight":
      case "ArrowDown":
        this.right.click();
        break;
    }
  }

  leftClick(event: Event) {
    event.stopPropagation();
    const { previous } = this.element.getNeighbors();
    if (previous) this.element = previous;
    this.render();
  }

  rightClick(event: Event) {
    event.stopPropagation();
    const { next } = this.element.getNeighbors();
    if (next) this.element = next;
    this.render();
  }

  render() {
    const { next, previous } = this.element.getNeighbors();
    this.img.src = this.element.img.src;
    this.left.disabled = !previous;
    this.right.disabled = !next;
  }
}

customElements.define("image-modal-element", ImageModalElement);
