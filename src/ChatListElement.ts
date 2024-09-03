import "./ChatListElement.css";
import { ChatListItemElement } from "./ChatListItemElement";
import { ChatStore } from "./ChatStore";
import { Element } from "./Element";

export class ChatListElement extends Element {
  chat_store = ChatStore.get();

  constructor() {
    super();
    this.render();
    this.chat_store.addEventListener(
      "change",
      this.render.bind(this),
      this.control,
    );
  }

  render() {
    for (const child of Array.from(this.children)) child.remove();
    for (const chat of this.chat_store.chats.values())
      this.append(new ChatListItemElement(chat));
  }
}

customElements.define("chat-list-element", ChatListElement);
