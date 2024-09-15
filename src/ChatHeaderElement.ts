import "./ChatHeaderElement.css";
import { Chat } from "./Chat";
import { ChatMenuElement } from "./ChatMenuElement";
import { Element } from "./Element";
import { createElement } from "./createElement";

export class ChatHeaderElement extends Element {
  heading = createElement("h4");
  model = createElement("i");

  constructor(readonly chat: Chat) {
    super();
    this.bind(chat, "change");
    this.append(createElement("div", {}, [this.heading, this.model]));
    this.oncontextmenu = () => ChatMenuElement({ chat });
    this.render();
  }

  render() {
    this.heading.innerText = this.chat.title;
    this.model.innerText = this.chat.model;
  }
}

customElements.define("chat-header-element", ChatHeaderElement);
