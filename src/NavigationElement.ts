import "./NavigationElement.css";
import { ActiveChatStore } from "./ActiveChatStore";
import { ChatListElement } from "./ChatListElement";
import { createElement } from "./createElement";

export class NavigationElement extends HTMLElement {
  active_chat_store = ActiveChatStore.get();

  constructor() {
    super();
    this.append(
      createElement("button", {
        innerText: "New Chat",
        onclick: () => this.active_chat_store.set(null),
      }),
      new ChatListElement(),
    );
  }
}

customElements.define("navigation-element", NavigationElement);
