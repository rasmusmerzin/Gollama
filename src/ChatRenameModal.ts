import "./ChatRenameModal.css";
import { Chat } from "./Chat";
import { Modal } from "./Modal";
import { createElement } from "./createElement";

export class ChatRenameModal extends Modal {
  title_label = createElement("h2", { innerText: "Rename Chat" });
  form = createElement("form");
  input = createElement("input", { type: "text" });
  button = createElement("button", { innerText: "Rename" });

  constructor(readonly chat: Chat) {
    super();
    this.input.value = chat.title;
    this.input.onchange = () => {
      this.button.disabled = !this.input.value;
    };
    this.button.onclick = () => {
      if (!this.input.value) return;
      chat.setTitle(this.input.value.trim());
      this.remove();
    };
    this.form.append(this.input, this.button);
    this.container.append(this.title_label, this.form);
    this.input.focus();
  }
}

customElements.define("chat-rename-modal", ChatRenameModal);
