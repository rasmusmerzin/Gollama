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
  span = createElement("span");

  constructor() {
    super();
    this.append(this.span);
    addEventListener("mousemove", this.mousemove.bind(this));
    addEventListener("click", this.mouseclick.bind(this));
  }

  mouseclick(event: MouseEvent) {
    const { clientX, clientY } = event;
    if (clientX === this.mouse.x && clientY === this.mouse.y)
      this.mousemove(event);
  }

  mousemove(event: MouseEvent) {
    this.target = getElementDescendant(
      event.target as HTMLElement,
      (descendant) => descendant.hasAttribute("tooltip"),
    );
    this.render();
  }

  render() {
    if (!this.target) return this.remove();
    this.span.innerText = this.target.getAttribute("tooltip") || "";
    if (!this.span.innerText) return this.remove();
    const height = this.span.clientHeight + 4;
    const target_rect = this.target.getBoundingClientRect();
    const x = target_rect.left + this.target.clientWidth / 2;
    let y = target_rect.top - 4;
    if (y - height < 0) {
      y = target_rect.bottom + 4;
      this.classList.add("bottom");
    } else this.classList.remove("bottom");
    this.style.setProperty("--x", x.toString());
    this.style.setProperty("--y", y.toString());
    const span_left = x - this.span.clientWidth / 2;
    const span_right = x + this.span.clientWidth / 2;
    if (span_left < 0) {
      const shift = 4 - span_left;
      this.span.style.setProperty("--shift", shift.toString());
    } else if (span_right > innerWidth) {
      const shift = innerWidth - span_right - 4;
      this.span.style.setProperty("--shift", shift.toString());
    } else this.span.style.removeProperty("--shift");
    if (!this.parentElement) document.body.append(this);
  }
}

customElements.define("tooltip-element", TooltipElement);

TooltipElement.get();
