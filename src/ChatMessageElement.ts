import "./ChatMessageElement.css";
import { ChatMessage } from "./ChatMessage";
import { Element } from "./Element";

export class ChatMessageElement extends Element {
  constructor(readonly chat_message: ChatMessage) {
    super();
    this.innerText = chat_message.content;
  }
}

customElements.define("chat-message-element", ChatMessageElement);
