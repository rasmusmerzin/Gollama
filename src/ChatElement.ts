import "./ChatElement.css";
import { Chat } from "./Chat";
import { Element } from "./Element";
import { createElement } from "./createElement";
import { ChatInputElement } from "./ChatInputElement";
import { ChatMessage } from "./ChatMessage";
import { ChatMessageElement } from "./ChatMessageElement";

export class ChatElement extends Element {
  container = createElement("div");
  input = new ChatInputElement();

  constructor(readonly chat: Chat) {
    super();
    chat.load();
    this.append(this.container, this.input);
    for (const message of chat.messages.values()) this.addMessage(message);
    this.bind(chat, "change", this.renderInput.bind(this));
    this.bind(chat, "add", this.addLastMessage.bind(this));
    this.bind(chat, "delete", this.ondelete.bind(this));
    this.renderInput();
  }

  renderInput() {
    this.input.disabled = this.chat.last_message?.loading || false;
    setTimeout(() => {
      this.input.focus();
      this.scrollToBottom();
    });
  }

  addLastMessage() {
    const msg = this.chat.last_message;
    if (msg) this.addMessage(msg);
  }

  addMessage(message: ChatMessage) {
    this.container.append(new ChatMessageElement(message));
    setTimeout(() => this.scrollToBottom());
  }

  scrollToBottom() {
    this.container.scrollTo(0, this.container.scrollHeight);
  }

  ondelete(event: Event) {
    const { detail } = <CustomEvent>event;
    this.container.querySelector(`#${detail}`)?.remove();
  }

  remove() {
    for (const child of Array.from(this.container.children)) child.remove();
    super.remove();
  }
}

customElements.define("chat-element", ChatElement);
