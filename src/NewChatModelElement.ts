import "./NewChatModelElement.css";
import { OllamaModel } from "./OllamaService";
import { Size } from "./Size";
import { createElement } from "./createElement";

export class NewChatModelElement extends HTMLElement {
  input: HTMLInputElement;

  constructor(readonly model: OllamaModel) {
    super();
    this.append(
      (this.input = createElement("input", { type: "radio", name: "model" })),
      createElement("label", { innerText: model.name }),
      createElement("span", { innerText: new Size(model.size).toString() }),
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
