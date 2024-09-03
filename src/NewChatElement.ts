import "./NewChatElement.css";
import { ActiveChatStore } from "./ActiveChatStore";
import { Chat } from "./Chat";
import { ChatStore } from "./ChatStore";
import { createElement } from "./createElement";

export class NewChatElement extends HTMLElement {
  active_chat_store = ActiveChatStore.get();
  chat_store = ChatStore.get();

  constructor() {
    super();
    this.append(
      createElement("button", {
        innerText: "Create New Chat",
        onclick: this.onSubmit.bind(this),
      }),
    );
  }

  onSubmit() {
    const chat = new Chat();
    this.chat_store.add(chat);
    this.active_chat_store.set(chat.id);
  }
}

customElements.define("new-chat-element", NewChatElement);
