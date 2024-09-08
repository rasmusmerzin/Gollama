import "./DialogueModal.css";
import { Modal } from "./Modal";
import { createElement } from "./createElement";

export interface DialogueOptions {
  title_text: string;
  body_text: string;
  submit_text?: string;
  color?: string;
  action: () => unknown;
}

export class DialogueModal extends Modal {
  title_label = createElement("h3");
  body_label = createElement("p");
  cancel_button = createElement("button", { innerText: "Cancel" });
  submit_button = createElement("button", { innerText: "OK" });

  constructor({
    title_text,
    body_text,
    submit_text,
    color,
    action,
  }: DialogueOptions) {
    super();
    this.title_label.innerText = title_text;
    this.body_label.innerText = body_text;
    if (submit_text) this.submit_button.innerText = submit_text;
    if (color) this.submit_button.style.color = color;
    this.cancel_button.onclick = () => this.remove();
    this.submit_button.onclick = () => {
      this.remove();
      action();
    };
    this.container.append(
      this.title_label,
      this.body_label,
      createElement("div", {}, [this.cancel_button, this.submit_button]),
    );
  }
}

customElements.define("dialogue-modal", DialogueModal);
