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
    chat.addEventListener("add", this.addLastMessage.bind(this), this.control);
  }

  addLastMessage() {
    this.addMessage(this.chat.last_message);
  }

  addMessage(message: ChatMessage) {
    this.container.append(new ChatMessageElement(message));
  }

  remove() {
    for (const child of Array.from(this.container.children)) child.remove();
    super.remove();
  }
}

customElements.define("chat-element", ChatElement);
