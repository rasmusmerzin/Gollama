import "./ChatListElement.css";
import { ChatListItemElement } from "./ChatListItemElement";
import { ChatStore } from "./ChatStore";
import { Element } from "./Element";

export class ChatListElement extends Element {
  chat_store = ChatStore.get();

  constructor() {
    super();
    this.bind(this.chat_store, "change");
    this.bind(window, "keydown", this.keydown.bind(this));
    this.render();
  }

  keydown(event: Event) {
    const { keyCode, ctrlKey, altKey } = event as KeyboardEvent;
    if (!ctrlKey && !altKey) return;
    const index = keyCode - 49;
    if (index < 0 || index > 8) return;
    (this.children[index] as HTMLElement)?.click();
  }

  render() {
    for (const child of Array.from(this.children)) child.remove();
    for (const chat of this.chat_store.chats.values())
      this.append(new ChatListItemElement(chat));
  }
}

customElements.define("chat-list-element", ChatListElement);
