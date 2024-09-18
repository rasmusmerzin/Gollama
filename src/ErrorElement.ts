import "./ErrorElement.css";
import logo from "./ollama.svg";
import { RouteStore } from "./RouteStore";
import { createElement } from "./createElement";

export class ErrorElement extends HTMLElement {
  route_store = RouteStore.get();

  error: HTMLElement;

  constructor() {
    super();
    this.append(
      createElement("img", { src: logo }),
      createElement("div", {
        innerText: "Couldn't communicate with Ollama service.",
      }),
      (this.error = createElement("code")),
      createElement("div", {
        innerText: "Make sure you have Ollama installed.",
      }),
      createElement("a", {
        innerText: "View installation instructions here.",
        href: "https://ollama.com/download",
        target: "_blank",
      }),
    );
  }

  start() {
    this.error.innerText = this.route_store.error || "null";
  }
}

customElements.define("error-element", ErrorElement);
