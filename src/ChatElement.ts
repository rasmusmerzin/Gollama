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
    this.append(this.container, this.input);
    for (const message of chat.messages) this.addMessage(message);
    chat.addEventListener("change", this.renderInput.bind(this), this.control);
    chat.addEventListener("add", this.addLastMessage.bind(this), this.control);
    chat.addEventListener("delete", this.ondelete.bind(this), this.control);
    this.renderInput();
  }

  renderInput() {
    this.input.disabled = this.chat.last_message?.loading;
    this.input.focus();
  }

  addLastMessage() {
    this.addMessage(this.chat.last_message);
  }

  addMessage(message: ChatMessage) {
    this.container.append(new ChatMessageElement(message));
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
