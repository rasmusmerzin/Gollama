import "./ChatInputElement.css";
import { Element } from "./Element";
import { createElement } from "./createElement";
import { ChatService } from "./ChatService";

export class ChatInputElement extends Element {
  chat_service = ChatService.get();

  input = createElement("input", { placeholder: "Write a message..." });
  button = createElement("button", { innerText: "Send" });

  constructor() {
    super();
    this.append(this.input, this.button);
    this.button.addEventListener("click", this.send.bind(this), this.control);
  }

  send() {
    this.chat_service.pushMessage(this.input.value);
    this.chat_service.generateResponse();
  }
}

customElements.define("chat-input-element", ChatInputElement);
