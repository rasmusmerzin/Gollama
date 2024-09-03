import "./ChatElement.css";
import { Chat } from "./Chat";
import { Element } from "./Element";

export class ChatElement extends Element {
  constructor(readonly chat: Chat) {
    super();
    this.innerText = chat.id;
  }
}

customElements.define("chat-element", ChatElement);
