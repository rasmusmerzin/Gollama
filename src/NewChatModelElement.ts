import "./NewChatModelElement.css";
import { Model } from "./Model";
import { createElement } from "./createElement";

export class NewChatModelElement extends HTMLElement {
  input: HTMLInputElement;

  constructor(readonly model: Model) {
    super();
    this.append(
      (this.input = createElement("input", { type: "radio", name: "model" })),
      createElement("label", { innerText: model.name }),
      createElement("span", { innerText: model.getSizeString() }),
    );
  }

  set(value: boolean) {
    this.input.checked = value;
    this.render();
  }

  render() {
    if (this.input.checked) this.classList.add("selected");
    else this.classList.remove("selected");
  }
}

customElements.define("new-chat-model-element", NewChatModelElement);
