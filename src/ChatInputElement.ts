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
    this.input.addEventListener("keyup", this.keyup.bind(this), this.control);
  }

  set disabled(value: boolean) {
    this.input.disabled = value;
    this.button.disabled = value;
  }

  focus() {
    this.input.focus();
  }

  keyup({ key }: KeyboardEvent) {
    if (key === "Enter") this.send();
  }

  async send() {
    await this.chat_service.ask(this.input.value);
    this.input.value = "";
  }
}

customElements.define("chat-input-element", ChatInputElement);
