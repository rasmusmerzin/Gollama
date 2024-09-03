import "./ChatListItemElement.css";
import { ActiveChatStore } from "./ActiveChatStore";
import { Chat } from "./Chat";
import { Element } from "./Element";

export class ChatListItemElement extends Element {
  active_chat_store = ActiveChatStore.get();

  constructor(readonly chat: Chat) {
    super();
    this.onclick = () => this.active_chat_store.set(this.chat.id);
    this.render();
    this.active_chat_store.addEventListener(
      "change",
      this.render.bind(this),
      this.control,
    );
  }

  render() {
    const selected = this.active_chat_store.chat_id === this.chat.id;
    if (selected) this.classList.add("selected");
    else this.classList.remove("selected");
    this.innerText = this.chat.title;
  }
}

customElements.define("chat-list-item-element", ChatListItemElement);
