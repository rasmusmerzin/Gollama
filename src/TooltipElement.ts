import "./TooltipElement.css";
import { getElementDescendant } from "./getElementDescendant";
import { createElement } from "./createElement";
import { Mouse } from "./Mouse";

export class TooltipElement extends HTMLElement {
  static instance?: TooltipElement;
  static get() {
    if (!this.instance) this.instance = new TooltipElement();
    return this.instance;
  }

  mouse = Mouse.get();
  target: HTMLElement | null = null;
  container = createElement("div", { className: "container" });
  text = createElement("span", { className: "text" });

  constructor() {
    super();
    this.container.append(this.text);
    this.append(this.container);
    addEventListener("mousemove", this.mousemove.bind(this));
    addEventListener("click", this.mouseclick.bind(this));
  }

  mouseclick(event: MouseEvent) {
    const { clientX, clientY } = event;
    if (clientX === this.mouse.x && clientY === this.mouse.y)
      this.mousemove(event);
  }

  mousemove(event: MouseEvent) {
    const target = getElementDescendant(
      event.target as HTMLElement,
      (descendant) => descendant.hasAttribute("tooltip"),
    );
    if (this.target !== target) {
      this.target = target;
      this.render();
    }
  }

  render() {
    this.container.style.removeProperty("--width");
    if (!this.target) return this.remove();
    const content = (this.target.getAttribute("tooltip") || "").trim();
    if (!content) return this.remove();
    this.text.innerText = content;
    if (!this.parentElement) document.body.append(this);
    this.renderWidth();
    this.renderPosition();
  }

  renderWidth() {
    const text_rect = this.text.getBoundingClientRect();
    const width = text_rect.right - text_rect.left;
    this.container.style.setProperty("--width", `${width}px`);
  }

  renderPosition() {
    if (!this.target) return;
    const margin = 8;
    const height = this.container.clientHeight + 4;
    const target_rect = this.target.getBoundingClientRect();
    const x = target_rect.left + this.target.clientWidth / 2;
    let y = target_rect.top - 4;
    if (y - height - margin < 0) {
      y = target_rect.bottom + 4;
      this.container.classList.add("bottom");
    } else this.container.classList.remove("bottom");
    this.style.setProperty("--x", x.toString());
    this.style.setProperty("--y", y.toString());
    const span_left = x - this.container.clientWidth / 2;
    const span_right = x + this.container.clientWidth / 2;
    if (span_left < 0) {
      const shift = margin - span_left;
      this.container.style.setProperty("--shift", shift.toString());
    } else if (span_right > innerWidth) {
      const shift = innerWidth - span_right - margin;
      this.container.style.setProperty("--shift", shift.toString());
    } else this.container.style.removeProperty("--shift");
  }
}

customElements.define("tooltip-element", TooltipElement);

TooltipElement.get();
