import "./ChatRenameModal.css";
import { Chat } from "./Chat";
import { Modal } from "./Modal";
import { createElement } from "./createElement";

export class ChatRenameModal extends Modal {
  input: HTMLInputElement;
  submit_button: HTMLButtonElement;

  constructor(readonly chat: Chat) {
    super();
    this.container.append(
      createElement("h2", { innerText: "Rename Chat" }),
      createElement(
        "form",
        {
          onsubmit: (event: Event) => {
            event.preventDefault();
            if (!this.input.value) return;
            chat.setTitle(this.input.value.trim());
            this.remove();
          },
        },
        [
          (this.input = createElement("input", {
            type: "text",
            value: chat.title,
            onchange: () => {
              this.submit_button.disabled = !this.input.value;
            },
          })),
          createElement("div", {}, [
            createElement("button", {
              innerText: "Cancel",
              onclick: () => this.remove(),
            }),
            (this.submit_button = createElement("button", {
              innerText: "Rename",
              className: "primary",
            })),
          ]),
        ],
      ),
    );
    this.input.focus();
  }
}

customElements.define("chat-rename-modal", ChatRenameModal);
