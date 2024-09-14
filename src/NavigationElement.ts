import "./NavigationElement.css";
import { ActiveChatStore } from "./ActiveChatStore";
import { ChatListElement } from "./ChatListElement";
import { createElement } from "./createElement";
import { Element } from "./Element";
import { NavigationStore } from "./NavigationStore";

export class NavigationElement extends Element {
  active_chat_store = ActiveChatStore.get();
  chat_list_store = NavigationStore.get();

  constructor() {
    super();
    this.append(
      createElement("button", {
        innerText: "New Chat",
        className: "new-chat",
        onclick: () => this.active_chat_store.set(null),
      }),
      new ChatListElement(),
      createElement("button", {
        className: "menu",
        title: "Press Ctrl+N to toggle menu",
        onclick: () => this.toggle(),
      }),
    );
    this.bind(this.chat_list_store, "change");
    this.bind(window, "keydown", this.keydown.bind(this));
    this.render();
  }

  keydown(event: Event) {
    const { key, ctrlKey } = event as KeyboardEvent;
    if (["N", "n"].includes(key) && ctrlKey) this.toggle();
  }

  toggle() {
    this.chat_list_store.set(!this.chat_list_store.open);
  }

  render() {
    if (this.chat_list_store.open) this.classList.remove("closed");
    else this.classList.add("closed");
  }
}

customElements.define("navigation-element", NavigationElement);
