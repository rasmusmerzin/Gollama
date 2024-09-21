import "./ChatListElement.css";
import { ChatListItemElement } from "./ChatListItemElement";
import { ChatStore } from "./ChatStore";
import { Element } from "./Element";

export class ChatListElement extends Element {
  chat_store = ChatStore.get();

  items = new Map<string, ChatListItemElement>();

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
    const item = Array.from(this.items.values())[index];
    item?.click();
  }

  render() {
    for (const [chat_id, item] of this.items) {
      if (this.chat_store.chats.has(chat_id)) continue;
      item.remove();
      this.items.delete(chat_id);
    }
    for (const chat of this.chat_store.chats.values()) {
      if (this.items.has(chat.id)) continue;
      const item = new ChatListItemElement(chat);
      this.items.set(chat.id, item);
      this.append(item);
    }
  }
}

customElements.define("chat-list-element", ChatListElement);
