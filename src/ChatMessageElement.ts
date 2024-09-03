import "./ChatMessageElement.css";
import { ChatMessage } from "./ChatMessage";
import { Element } from "./Element";
import { createElement } from "./createElement";

export class ChatMessageElement extends Element {
  content = createElement("div");

  constructor(readonly message: ChatMessage) {
    super();
    this.append(this.content);
    this.render();
    message.addEventListener("change", this.render.bind(this), this.control);
  }

  render() {
    if (this.message.loading) this.classList.add("loading");
    else this.classList.remove("loading");
    this.classList.add(this.message.role);
    this.content.innerText = this.message.content;
  }
}

customElements.define("chat-message-element", ChatMessageElement);
