import "./ChatListItemElement.css";
import { ActiveChatStore } from "./ActiveChatStore";
import { Chat } from "./Chat";
import { ChatMenu } from "./ChatMenu";
import { Element } from "./Element";
import { createElement } from "./createElement";

export class ChatListItemElement extends Element {
  active_chat_store = ActiveChatStore.get();

  name = createElement("div");
  model = createElement("i");

  constructor(readonly chat: Chat) {
    super();
    this.tabIndex = 0;
    this.append(this.name, this.model);
    this.bind(this.chat, "change");
    this.bind(this.active_chat_store, "change");
    this.onclick = () => this.active_chat_store.set(this.chat.id);
    this.oncontextmenu = () => ChatMenu({ target: this, chat });
    this.render();
  }

  render() {
    const selected = this.active_chat_store.chat_id === this.chat.id;
    if (selected) this.classList.add("selected");
    else this.classList.remove("selected");
    this.title = this.name.innerText = this.chat.title;
    this.model.innerText = this.chat.model;
  }
}

customElements.define("chat-list-item-element", ChatListItemElement);
