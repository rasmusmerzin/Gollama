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
  submit_button: HTMLButtonElement;

  constructor({
    title_text,
    body_text,
    submit_text,
    color,
    action,
  }: DialogueOptions) {
    super();
    this.container.append(
      createElement("h2", { innerText: title_text }),
      createElement("p", { innerText: body_text }),
      createElement("div", {}, [
        createElement("button", {
          innerText: "Cancel",
          onclick: () => this.remove(),
        }),
        (this.submit_button = createElement("button", {
          innerText: submit_text || "OK",
          className: "primary",
          onclick: () => {
            this.remove();
            action();
          },
        })),
      ]),
    );
    if (color) this.submit_button.style.setProperty("--color", color);
  }
}

customElements.define("dialogue-modal", DialogueModal);
